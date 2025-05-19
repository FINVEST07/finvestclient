"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { encryptData } from "@/utils/Security";

const Adminlogin = () => {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormdata((prev) => ({ ...prev, [name]: value }));
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

      if (response.status == 200) {
        
        
        localStorage.setItem("rank",response.data.rank);
        localStorage.setItem("email",response.data.email);
        if (response.data.rank == 1 || response.data.rank == "1") {
          navigate("/admindashboard");
        } else {
          navigate("/adminapplications?tab=applications");
        }
      } else {
        setError("Unexpected error occurred");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

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
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Adminlogin;
