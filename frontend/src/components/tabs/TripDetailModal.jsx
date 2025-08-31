"use client";

export default function TripDetailModal({ trip, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
        >
          ×
        </button>

        <img
          src={trip.imageUrl || "/default-trip-image.jpg"}
          alt={trip.destination}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{trip.destination}</h2>
        <p className="text-gray-600 mb-2">
          Trip with <span className="font-semibold">{trip.creator?.name}</span>
        </p>
        <p className="text-gray-500 mb-4">
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>

        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="mb-4">{trip.description || "No description provided."}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-yellow-300 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
