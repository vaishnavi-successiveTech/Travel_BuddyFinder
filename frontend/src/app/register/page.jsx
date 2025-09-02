"use client";

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useSubscription } from "@apollo/client/react";
import gql from "graphql-tag";

export const NEW_USER_SUBSCRIPTION = gql`
  subscription OnNewUser {
    newUser {
      _id
      name
      email
      gender
    }
  }
`;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Listen to new user registrations via GraphQL subscription
  const { data: subscriptionData } = useSubscription(NEW_USER_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData?.newUser) {
      setNotifications((prev) => [subscriptionData.newUser, ...prev]);
    }
  }, [subscriptionData]);

  const validateForm = () => {
    if (!/^[A-Za-z\s'-]{3,30}$/.test(name)) {
      return "Name must be 3–30 characters and only contain alphabets, spaces, hyphens, or apostrophes.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password
      )
    ) {
      return "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";
    }
    if (!gender) {
      return "Please select a gender.";
    }
    return null; // ✅ no errors
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

       const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        gender,
      });
      setSuccess("Registration successful! Please log in.");
      setName("");
      setEmail("");
      setPassword("");
      setGender("");
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image/backgroundImage.png')" }}
    >
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-md opacity-80">
        <h2 className="text-2xl font-bold text-center mb-6">SIGN UP</h2>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-4 p-2 bg-green-800 rounded max-h-40 overflow-y-auto">
            {notifications.map((n) => (
              <p key={n._id} className="text-sm">
                New user registered: {n.name} ({n.email})
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition cursor-pointer"
          >
            Register
          </button>

          <p className="mt-3 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-emerald-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
