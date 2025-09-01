"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({});
  const [privacyForm, setPrivacyForm] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setProfileForm({
          name: res.data.name || "",
          email: res.data.email || "",
          // phone: res.data.phone || "",
          age: res.data.age || "",
          gender: res.data.gender || "other",
          interests: res.data.interests || [],
          languages: res.data.languages || [],
          travelStyle: res.data.travelStyle || [],
        });
        setPrivacyForm({
          showLimitedUntilTrusted:
            res.data.visibility.showLimitedUntilTrusted || true,
        });
        setBlockedUsers(res.data.safetyFlags.blockedUserIds || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchReports() {
      try {
        const res = await api.get("/safety/myReports");
        setReports(res.data.reports || []);
      } catch (err) {
        console.error(err);
      }
    }
    async function fetchBlockedUsers() {
      try {
        const res = await api.get("/safety/myBlockedUsers");
        setBlockedUsers(res.data.blockedUsers || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUserData();
    fetchReports();
    fetchBlockedUsers();
  }, []);

  if (loading) return <LoadingSpinner />;;

  // Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacyForm({ ...privacyForm, [name]: checked });
  };

  const updateProfile = async () => {
    try {
      await api.patch("/auth/updateProfile", profileForm);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const updatePrivacy = async () => {
    try {
      await api.patch("/auth/updatePrivacy", privacyForm);
      alert("Privacy settings updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update privacy");
    }
  };

  const unblockUser = async (userId) => {
    try {
      await api.post("/safety/unblock", { blockedUserId: userId });
      setBlockedUsers(blockedUsers.filter((id) => id !== userId));
      alert("User unblocked!");
    } catch (err) {
      console.error(err);
      alert("Failed to unblock user");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      {/* Profile Settings */}
      <section className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2"> Update Profile </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profileForm.name}
            onChange={handleProfileChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profileForm.email}
            onChange={handleProfileChange}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={profileForm.age}
            onChange={handleProfileChange}
            className="border p-2 rounded w-full"
          />
          <select
            name="gender"
            value={profileForm.gender}
            onChange={handleProfileChange}
            className="border p-2 rounded w-full"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="interests"
            placeholder="Interests (comma separated)"
            value={profileForm.interests.join(", ")}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                interests: e.target.value.split(",").map((i) => i.trim()),
              })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="languages"
            placeholder="Languages (comma separated)"
            value={profileForm.languages.join(", ")}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                languages: e.target.value.split(",").map((i) => i.trim()),
              })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="travelStyle"
            placeholder="Travel Style (comma separated)"
            value={profileForm.travelStyle.join(", ")}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                travelStyle: e.target.value.split(",").map((i) => i.trim()),
              })
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={updateProfile}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
        >
          Save Profile
        </button>
      </section>

      {/* Privacy & Visibility */}
      <section className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Privacy & Visibility</h2>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            name="showLimitedUntilTrusted"
            checked={privacyForm.showLimitedUntilTrusted}
            onChange={handlePrivacyChange}
          />
          <span>Show limited info until trusted</span>
        </div>
        <button
          onClick={updatePrivacy}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
        >
          Save Privacy Settings
        </button>
        {/* Blocked Users */}
     
        {/* <div className="mt-4">
          <h3 className="font-semibold mb-2">Blocked Users</h3>
          {blockedUsers.length === 0 ? (
            <p>No blocked users</p>
          ) : (
            <ul className="space-y-1">
              {blockedUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>
                    {user.name} ({user.email})
                  </span>
                  <button
                    onClick={() => unblockUser(user._id)}
                    className="text-red-500 underline hover:text-red-700"
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div> */}
        {/* Report History */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Report History</h3>
          {reports.length === 0 ? (
            <p>No reports submitted</p>
          ) : (
            <ul className="space-y-1">
              {reports.map((r) => (
                <li key={r._id} className="bg-gray-100 p-2 rounded">
                  <p>
                    Reported{" "}
                    <span className="font-semibold">
                      {r.targetUser?.name || "Trip"}
                    </span>{" "}
                    - <span className="text-sm text-gray-600">{r.reason}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Verification Status */}
      {/* <section className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Verification</h2>
        <p>Email Verified: {user.verification.emailVerified ? "✅" : "❌"}</p>
        <p>Phone Verified: {user.verification.phoneVerified ? "✅" : "❌"}</p>
        <p>ID Verified: {user.verification.idVerified ? "✅" : "❌"}</p>
      </section> */}
    </div>
  );
}
