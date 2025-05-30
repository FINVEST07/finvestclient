"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decryptData, encryptData } from "@/utils/Security";
import { Eye, EyeOff } from "lucide-react";

const Adminlogin = () => {
  const [step, setStep] = useState("login"); // 'login' or 'forgot-password'
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOtpGenerated, setForgotPasswordOtpGenerated] =
    useState(false);
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  // Timer effect for forgot password OTP
  useEffect(() => {
    if (forgotPasswordTimer <= 0) return;

    const countdown = setInterval(() => {
      setForgotPasswordTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [forgotPasswordTimer]);

  const handleChange = ({ target: { name, value } }) => {
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordChange = ({ target: { name, value } }) => {
    setForgotPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const encryptedformdata = encryptData(formdata, import.meta.env.VITE_UTIL);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}adminlogin`,
        {
          payload: encryptedformdata,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const decryptedpayload = decryptData(
        response.data.payload,
        import.meta.env.VITE_UTIL
      );

      localStorage.setItem("rank", decryptedpayload.rank);
      localStorage.setItem("email", decryptedpayload.email);
      if (decryptedpayload.rank == 1 || decryptedpayload.rank == "1") {
        navigate("/admindashboard");
      } else {
        navigate("/adminapplications?tab=applications");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const SendForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}sendforgotpasswordotp`,
        {
          email: forgotPasswordData.email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setForgotPasswordOtpGenerated(true);
      setForgotPasswordTimer(120);
      setError("");
      // You might want to show a success message here
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const HandleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (forgotPasswordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}resetadminpassword`,
        {
          payload: forgotPasswordData,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Reset Successful");

      // Reset form and go back to login
      setStep("login");
      setForgotPasswordData({
        email: "",
        otp: "",
        newPassword: "",
      });
      setForgotPasswordOtpGenerated(false);
      setForgotPasswordTimer(0);
      setError("");
      // You might want to show a success message here
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {step === "login" ? (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Login
            </h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formdata.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0.5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setStep("forgot-password")}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F172A] text-white py-2 rounded-md transition hover:bg-[#1e293b] disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Reset Password
            </h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={HandleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={forgotPasswordData.email}
                  onChange={handleForgotPasswordChange}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="otp"
                    value={forgotPasswordData.otp}
                    onChange={handleForgotPasswordChange}
                    disabled={!forgotPasswordOtpGenerated}
                    className="flex-1 px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Enter OTP"
                    required
                  />
                  <button
                    type="button"
                    disabled={forgotPasswordTimer > 0 || loading}
                    onClick={SendForgotPasswordOtp}
                    className="px-4 py-2 mt-1 bg-[#0F172A] text-white rounded-md transition hover:bg-[#1e293b] disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
                {forgotPasswordOtpGenerated && (
                  <p className="text-sm text-gray-600 mt-1">
                    {forgotPasswordTimer > 0
                      ? `OTP will expire in ${forgotPasswordTimer} seconds`
                      : "OTP expired, request a new one"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0.5"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!forgotPasswordOtpGenerated || loading}
                className="w-full bg-[#0F172A] text-white py-2 rounded-md transition hover:bg-[#1e293b] disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setError("");
                  setForgotPasswordData({
                    email: "",
                    otp: "",
                    newPassword: "",
                  });
                  setForgotPasswordOtpGenerated(false);
                  setForgotPasswordTimer(0);
                }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm underline"
              >
                Back to Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Adminlogin;
