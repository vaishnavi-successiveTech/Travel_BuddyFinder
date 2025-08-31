"use client";

import { useState } from "react";
import PlaceDetailModal from "./TripDetailModal";

export default function PlaceCard({ place }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="border p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">{place.name}</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-yellow-300 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 shadow"
      >
        Detail
      </button>

      <PlaceDetailModal
        place={place}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
