"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function TripDetailModal({ trip, isOpen, onClose }) {
  const [isReporting, setIsReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // --- Handle report ---
  const handleReport = async () => {
    if (!reason) return alert("Please select a reason");

    setLoading(true);
    try {
      await api.post("/safety/report", {
        targetTrip: trip._id,
        targetUser: trip.creator?._id,
        reason,
        details,
      });
      alert("Report submitted successfully!");
      setReason("");
      setDetails("");
      setIsReporting(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle block ---
  const handleBlock = async () => {
    if (!trip.creator?._id) return alert("No creator to block");
    try {
      await api.post("/safety/block", { blockedUserId: trip.creator._id });
      alert(`Blocked user: ${trip.creator.name}`);
      onClose(); // optionally close modal after blocking
    } catch (err) {
      console.error(err);
      alert("Failed to block user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
        >
          ×
        </button>

        {/* Trip Image */}
        <img
          src={trip.imageUrl || "/default-trip-image.jpg"}
          alt={trip.destination}
          className="w-full h-40 sm:h-56 md:h-64 object-cover rounded-lg mb-4"
        />

        {/* Trip Info */}
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center sm:text-left">
          {trip.destination}
        </h2>
        <p className="text-gray-600 mb-2 text-center sm:text-left">
          Trip by <span className="font-semibold">{trip.creator?.name}</span>
        </p>
        <p className="text-gray-500 mb-4 text-center sm:text-left">
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>

        <h3 className="text-lg sm:text-xl font-semibold mb-2">Description</h3>
        <p className="mb-4 text-sm sm:text-base">
          {trip.description || "No description provided."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <button
            onClick={() => setIsReporting(!isReporting)}
            className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-600 shadow w-full sm:w-auto"
          >
            {isReporting ? "Cancel Report" : "Report Trip"}
          </button>

          <button
            onClick={handleBlock}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 shadow w-full sm:w-auto"
          >
            Block Creator
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-black font-semibold py-2 px-4 rounded hover:bg-gray-400 shadow w-full sm:w-auto"
          >
            Close
          </button>
        </div>

        {/* Report Form */}
        {isReporting && (
          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-gray-700 text-sm sm:text-base">
              You are reporting{" "}
              <span className="font-semibold">{trip.destination}</span> and its
              creator{" "}
              <span className="font-semibold">{trip.creator?.name}</span>
            </p>

            <select
              className="border border-gray-300 rounded px-2 py-2 w-full mb-2 text-sm sm:text-base"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option value="spam">Spam</option>
              <option value="abuse">Abuse</option>
              <option value="fake profile">Fake Profile</option>
            </select>

            <textarea
              className="border border-gray-300 rounded px-2 py-2 w-full mb-2 resize-none text-sm sm:text-base"
              placeholder="Additional details (optional)"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            <button
              onClick={handleReport}
              disabled={loading}
              className="bg-yellow-600 text-white font-semibold py-2 px-4 rounded w-full hover:bg-yellow-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
