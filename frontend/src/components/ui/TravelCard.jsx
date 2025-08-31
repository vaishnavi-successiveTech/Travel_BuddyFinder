"use client";
import { useState } from "react";
import { Users, Wallet } from "lucide-react";
import TripDetailModal from "../tabs/TripDetailModal";


export default function TravelCard({ trip }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image */}
        <div className="md:w-1/3">
          <img
            src={trip.imageUrl || "https://via.placeholder.com/300x200"}
            alt="Trip"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Trip Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{trip.destination}</h2>
            <p className="text-gray-600 mb-1">
              Trip with <span className="font-semibold">{trip.creator?.name}</span>
            </p>
            <p className="text-gray-500">
              {new Date(trip.startDate).toLocaleDateString()} -{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Looking for:</span>
              <span className="text-emerald-500 font-bold">
                {trip.creator?.gender?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Type of journey:</span>
              <span className="text-emerald-500 font-bold">
                {trip.travelStyle?.join(", ") || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Split costs:</span>
              <span className="text-emerald-500 font-bold">{trip.openToJoin ? "YES" : "NO"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Budget:</span>
              <span className="text-emerald-500 font-bold">{trip.budget?.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-emerald-700 font-semibold underline cursor-pointer">
              {trip.creator?.name}, {trip.creator?.age}
            </span>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-yellow-300 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 shadow"
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <TripDetailModal trip={trip} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
