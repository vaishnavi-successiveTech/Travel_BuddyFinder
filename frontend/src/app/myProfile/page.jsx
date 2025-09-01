"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; // axios wrapper
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner />;;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6 text-center">
      {/* 🚨 Notification if profile not completed */}
      {!profile.profileCompleted && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
          <p className="mb-2 font-medium">Your profile is incomplete 🚨</p>
          <button
             onClick={() => router.push("/?tab=complete")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
      </div>

      {/* User Info */}
      <h2 className="text-2xl font-bold">{profile.name}</h2>
      <p className="text-gray-600">{profile.email}</p>
      <p className="text-gray-500 capitalize">{profile.gender}</p>

      {/* 🔙 Back Button */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
