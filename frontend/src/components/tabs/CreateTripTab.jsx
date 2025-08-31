"use client";

import { useState } from "react";
import axios from "axios";
import api from "@/lib/api";

export default function CreateTripTab() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    activities: "",
    openToJoin: true,
    budget: "mid",
    travelStyle: "",
    maxGroupSize: 1,
    imageUrl: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (formData.description.length > 500) {
    alert("Description cannot exceed 500 characters.");
    return;
  }
    try {
      const token = localStorage.getItem("token"); // or wherever you store JWT

      await api.post(
        "/trips/details",
        {
          ...formData,
          activities: formData.activities.split(",").map((a) => a.trim()),
          travelStyle: formData.travelStyle.split(",").map((s) => s.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send JWT to backend
          },
        }
      );

      alert("Trip created successfully!");
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        activities: "",
        openToJoin: true,
        budget: "mid",
        travelStyle: "",
        maxGroupSize: 4,
        imageUrl: "",
        description:"",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating trip. Make sure you are logged in.");
    }
  };

  return (
    <div className="p-6 bg-emerald-50 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-3xl font-extrabold mb-3 text-emerald-800">
        Create Trip
      </h2>
      <p className="text-gray-800 mb-6">
        Plan and share your next adventure with the community.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe your trip..."
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={4}
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          min={new Date().toISOString().split("T")[0]} // ✅ today’s date
          required
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          min={formData.startDate || new Date().toISOString().split("T")[0]} // ✅ after start date
          required
        />
        <input
          type="text"
          name="activities"
          placeholder="Activities (comma separated)"
          value={formData.activities}
          onChange={handleChange}
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="text"
          name="travelStyle"
          placeholder="Travel Style (comma separated)"
          value={formData.travelStyle}
          onChange={handleChange}
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          name="maxGroupSize"
          placeholder="Max Group Size"
          value={formData.maxGroupSize}
          onChange={handleChange}
          min={1} // ✅ prevents negative numbers
          className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300  text-black rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="low">Low</option>
          <option value="mid">Mid</option>
          <option value="high">High</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="openToJoin"
            checked={formData.openToJoin}
            onChange={handleChange}
            className="accent-emerald-500"
          />
          <span className="text-gray-800">Open to Join</span>
        </label>

        {/* Primary Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          Create Trip
        </button>

        {/* Secondary Button (example, not used here) */}
        {/* <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded transition-colors">
          Cancel
        </button> */}
      </form>
    </div>
  );
}
