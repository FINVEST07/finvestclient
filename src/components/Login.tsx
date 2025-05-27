import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ToastContainerComponent from "./ToastContainerComponent";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ setLoginOpen, loginopen }) => {
  const [step, setStep] = useState("form"); // 'form', 'verify', or 'forgot-password'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loginformdata, setLoginFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [loginwithotp, setLoginWithOtp] = useState(true);
  const [loginotpgenerated, setloginOtpGenerated] = useState(false);
  const [forgotPasswordOtpGenerated, setForgotPasswordOtpGenerated] =
    useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpbox, setOtpBox] = useState(false);
  const [logintimer, setLoginTimer] = useState(0);
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false); // State for login password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility

  const [sectionopen, setSectionOpen] = useState("register");

  const cookie = Cookie.get("finvest");
  const cookieemail = cookie ? cookie.split("$")[0] : "";

  const navigate = useNavigate();

  const CloseIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-auto"
        viewBox="0 0 384 512"
        fill="#062c7e"
        width={20}
        onClick={() => setLoginOpen(false)}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  };

  // Countdown for 2 minutes
  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    if (logintimer <= 0) return;

    const countdown = setInterval(() => {
      setLoginTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [logintimer]);

  useEffect(() => {
    if (forgotPasswordTimer <= 0) return;

    const countdown = setInterval(() => {
      setForgotPasswordTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [forgotPasswordTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // clear error when user types
  };

  const handleLoginFormChnage = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SendLoginOtp = async (e) => {
    e.preventDefault();

    try {
      const sendOtpResponse = await axios.post(
        `${import.meta.env.VITE_API_URI}sendloginotp`,
        {
          email: loginformdata.email,
        }
      );

      if (sendOtpResponse.status !== 200) {
        toast.error(sendOtpResponse.data.message);
        return;
      }
      setloginOtpGenerated(true);
      setLoginTimer(120);

      toast.success(sendOtpResponse.data.message);
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  const SendForgotPasswordOtp = async (e) => {
    e.preventDefault();

    try {
      const sendOtpResponse = await axios.post(
        `${import.meta.env.VITE_API_URI}sendforgotpasswordotp`,
        {
          email: forgotPasswordData.email,
        }
      );

      if (sendOtpResponse.status !== 200) {
        toast.error(sendOtpResponse.data.message);
        return;
      }
      setForgotPasswordOtpGenerated(true);
      setForgotPasswordTimer(120);

      toast.success(sendOtpResponse.data.message);
    } catch (error) {
      if (error.response?.data?.status === false) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const HandleForgotPassword = async (e) => {
    e.preventDefault();

    if (forgotPasswordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const resetPasswordResponse = await axios.post(
        `${import.meta.env.VITE_API_URI}resetpassword`,
        {
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword,
        }
      );

      toast.success(resetPasswordResponse.data.message);
      setStep("form");
      setSectionOpen("login");
      setForgotPasswordData({
        email: "",
        otp: "",
        newPassword: "",
      });
      setForgotPasswordOtpGenerated(false);
      setForgotPasswordTimer(0);
    } catch (error) {
      if (error.response?.data?.status === false) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const Handlelogin = async (e) => {
    e.preventDefault();

    try {
      if (loginwithotp) {
        const loginresponse = await axios.post(
          `${import.meta.env.VITE_API_URI}loginwithotp`,
          {
            email: loginformdata.email,
            otp: loginformdata.otp,
          }
        );

        Cookie.set(
          "finvest",
          `${loginformdata.email}$${loginresponse.data.mobile}`,
          { expires: 365 }
        );

        toast.success(loginresponse.data.message);
        setLoginOpen(false);
        setLoginFormData({
          email: "",
          password: "",
          otp: "",
        });
        navigate("/customerdashboard");
      } else {
        const loginresponse = await axios.post(
          `${import.meta.env.VITE_API_URI}loginwithpassword`,
          {
            email: loginformdata.email,
            password: loginformdata.password,
          }
        );

        Cookie.set(
          "finvest",
          `${loginformdata.email}$${loginresponse.data.mobile}`,
          { expires: 365 }
        );

        setLoginTimer(0);
        toast.success(loginresponse.data.message);
        setLoginOpen(false);
        setLoginFormData({
          email: "",
          password: "",
          otp: "",
        });
        navigate("/customerdashboard");
      }
    } catch (error) {
      if (error.response?.data?.status === false) {
        toast.error(error.response.data.message);
      } else {
        // Generic error fallback
        toast.error("something went wrong");
      }
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return; // prevent the API call if password is too short
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}adduser`,
        {
          payload: formData,
        }
      );

      // Success case (when status is true)
      toast.success(response.data.message);
      setLoginTimer(120);
      setStep("verify");
      setTimer(120);
    } catch (error) {
      // Check if it's an HTTP error with response data
      if (error.response?.data?.status === false) {
        toast.error(error.response.data.message);
      } else {
        // Generic error fallback
        toast.error("something went wrong");
      }
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}verifyotp`,
        {
          email: formData.email,
          otp: otp,
        }
      );

      Cookie.set("finvest", `${formData.email}$${formData.mobile}`, {
        expires: 365,
      });

      toast.success(response.data.message);

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });
      setLoginOpen(false);
      setTimer(0);
      navigate("/customerdashboard");
    } catch (error) {
      setStep("form");

      // Check if it's an HTTP error with response data
      if (error.response?.data?.status === false) {
        toast.error(error.response.data.message);
      } else {
        // Generic error fallback
        toast.error("something went wrong");
      }
    }
  };

  return (
    <>
      <ToastContainerComponent />
      {!cookieemail && loginopen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            {step === "form" ? (
              <>
                <CloseIcon />
                <h2 className="text-2xl font-bold mb-4 text-center cursor-pointer">
                  <span onClick={() => setSectionOpen("register")}>
                    Register
                  </span>{" "}
                  | <span onClick={() => setSectionOpen("login")}>Login</span>
                </h2>

                {sectionopen === "register" ? (
                  <form onSubmit={sendOtp}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded-lg"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded-lg"
                      required
                    />
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded-lg"
                      required
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <input
                      type="submit"
                      value="Send Otp"
                      className="w-full bg-blue-900 text-white py-2 rounded-lg transition"
                    />
                  </form>
                ) : (
                  <form>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={loginformdata.email}
                      onChange={handleLoginFormChnage}
                      className="w-full p-2 mb-3 border rounded-lg"
                      required
                    />
                    {loginwithotp ? (
                      <>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={loginformdata.otp}
                            onChange={handleLoginFormChnage}
                            disabled={!loginotpgenerated}
                            className="w-full p-2 border rounded-lg"
                            required
                          />
                          <button
                            disabled={logintimer > 0}
                            className="w-[40%] bg-blue-900 rounded-md text-white py-2"
                            onClick={SendLoginOtp}
                          >
                            Send OTP
                          </button>
                        </div>
                        <p
                          onClick={() => setLoginWithOtp(false)}
                          className="text-right text-blue-900 cursor-pointer"
                        >
                          Login with Password ?
                        </p>
                        {loginotpgenerated && (
                          <p className="text-center">
                            {logintimer > 0
                              ? `OTP will Expire in ${logintimer} Seconds`
                              : "OTP Expired, Request a new One"}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Password"
                            value={loginformdata.password}
                            onChange={handleLoginFormChnage}
                            className="w-full p-2 mb-3 border rounded-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowLoginPassword(!showLoginPassword)
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          >
                            {showLoginPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <div className="flex justify-end gap-2 items-center text-sm">
                          <p
                            onClick={() => setLoginWithOtp(true)}
                            className="text-blue-900 cursor-pointer"
                          >
                            Login with OTP ?
                          </p>
                          <span className="text-gray-400">|</span>
                          <p
                            onClick={() => setStep("forgot-password")}
                            className="text-blue-900 cursor-pointer"
                          >
                            Forgot Password ?
                          </p>
                        </div>
                      </>
                    )}
                    <button
                      disabled={loginwithotp && !loginotpgenerated}
                      className="w-full mt-2 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      onClick={Handlelogin}
                    >
                      Login
                    </button>
                  </form>
                )}
              </>
            ) : step === "verify" ? (
              <>
                <h2 className="text-xl font-semibold mb-2 text-center">
                  Enter OTP
                </h2>
                <p className="text-sm text-gray-500 text-center mb-4">
                  OTP sent to {formData.email}. Valid for{" "}
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 mb-3 border rounded-lg"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Verify OTP
                </button>
                {timer <= 0 && (
                  <p className="text-red-500 text-center mt-2">
                    OTP expired. Please go back.
                  </p>
                )}
                <button
                  onClick={() => setStep("form")}
                  className="w-full text-sm text-blue-600 mt-4 underline"
                >
                  Go Back
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2 text-center">
                  Reset Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Enter your email to receive OTP for password reset
                </p>
                <form onSubmit={HandleForgotPassword}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    className="w-full p-2 mb-3 border rounded-lg"
                    required
                  />
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={forgotPasswordData.otp}
                      onChange={handleForgotPasswordChange}
                      disabled={!forgotPasswordOtpGenerated}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      disabled={forgotPasswordTimer > 0}
                      className="w-[40%] bg-blue-900 rounded-md text-white py-2"
                      onClick={SendForgotPasswordOtp}
                    >
                      Send OTP
                    </button>
                  </div>
                  {forgotPasswordOtpGenerated && (
                    <p className="text-center text-sm mb-3">
                      {forgotPasswordTimer > 0
                        ? `OTP will Expire in ${forgotPasswordTimer} Seconds`
                        : "OTP Expired, Request a new One"}
                    </p>
                  )}
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter New Password"
                      value={forgotPasswordData.newPassword}
                      onChange={handleForgotPasswordChange}
                      className="w-full p-2 mb-3 border rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!forgotPasswordOtpGenerated}
                    className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Reset Password
                  </button>
                </form>
                <button
                  onClick={() => {
                    setStep("form");
                    setSectionOpen("login");
                  }}
                  className="w-full text-sm text-blue-600 mt-4 underline"
                >
                  Go Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
