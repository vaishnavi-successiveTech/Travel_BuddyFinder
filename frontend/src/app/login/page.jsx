"use client";
import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      setError("");
      localStorage.setItem("token", response.data.token);
      login(response.data.token);
      router.push("/afterLogin")
      
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        {/* Left Side - Image with overlay text (hidden on small screens) */}
        <div className="relative hidden md:flex w-1/2">
          <img
            src="/image/login.jpg"
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-900/40 flex flex-col justify-center items-center text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-center text-sm">
              Please log in using your personal information to stay connected with us.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 bg-gray-50">
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-700">
            Login 
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between items-center text-sm">
              <a href="/forget" className="text-emerald-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
            >
              Log In
            </button>

            <p className="text-center text-sm mt-4 text-gray-600">
              Don’t have an account?{" "}
              <a href="/register" className="text-emerald-600 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

