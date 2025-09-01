"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TripDetailModal from "./TripDetailModal";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function BuddiesTab({ tripId }) {
  const [matches, setMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Normalize server response to { myTrip, buddyTrip }
  const normalizeMatchesResponse = (data) => {
    if (!data) return [];
    if (
      Array.isArray(data) &&
      data.length &&
      data[0].buddyTrip === undefined &&
      data[0].myTrip === undefined
    ) {
      return data.map((trip) => ({ myTrip: null, buddyTrip: trip }));
    }
    return Array.isArray(data) ? data : [];
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAllMatches = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/api/match", {
          withCredentials: true,
        });
        if (cancelled) return;
        const normalized = normalizeMatchesResponse(res.data);
        setMatches(normalized);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load matches");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchRecentMatches = async () => {
      if (!tripId) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/api/match/${tripId}`,
          {
            withCredentials: true,
          }
        );
        if (cancelled) return;
        const normalized = normalizeMatchesResponse(res.data);
        setRecentMatches(normalized);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllMatches();
    fetchRecentMatches();

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const handleJoinTrip = async (matchTripId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/trips/${matchTripId}/join`,
        {},
        { withCredentials: true }
      );
      alert("Requested to join the trip!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join trip");
    }
  };

  const handleMessage = (creatorId) => {
    if (!creatorId) return;
    router.push(`/chat/${creatorId}`);
  };

  if (loading) return <LoadingSpinner />;;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!matches.length) return <p>No matching trips found.</p>;

  return (
    <div className="space-y-8">
      {/* Highlight Recent Trip Matches */}
      {recentMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-600">
            Recent Trip Matches
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {recentMatches.map((match) => (
              <TripCard
                key={match.buddyTrip._id}
                trip={match.buddyTrip}
                myTrip={match.myTrip}
                onJoin={handleJoinTrip}
                onMessage={handleMessage}
                router={router}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Matches (including recent matches again) */}
      {matches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-600">
            All Matching Trips
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto pr-2">
            {matches.map((match) => (
              <TripCard
                key={match.buddyTrip._id}
                trip={match.buddyTrip}
                myTrip={match.myTrip}
                onJoin={handleJoinTrip}
                onMessage={handleMessage}
                router={router}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TripCard({ trip, myTrip, onJoin, onMessage, router }) {
   const [isModalOpen, setIsModalOpen] = useState(false);
  const creator = trip?.creator || {};
  return (
    <div className="border rounded p-4 shadow flex flex-col w-full max-w-sm">
      <img
        src={trip.imageUrl || "/default-trip.jpg"}
        alt={trip.destination}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="font-bold text-lg">{trip.destination}</h3>
      {myTrip && (
        <p className="text-sm text-gray-500">
          Matched with your trip:{" "}
          <span className="font-medium">
            {new Date(myTrip.startDate).toLocaleDateString()} -{" "}
            {new Date(myTrip.endDate).toLocaleDateString()}
          </span>
        </p>
      )}
      <p className="mt-1">By: {creator?.name || "Unknown"}</p>
      <p className="text-sm">
        Dates: {new Date(trip.startDate).toLocaleDateString()} -{" "}
        {new Date(trip.endDate).toLocaleDateString()}
      </p>
      <p className="text-sm">Budget: {trip.budget}</p>
      <p className="text-sm">Travel Style: {trip.travelStyle?.join(", ")}</p>
      <p className="text-sm mb-2">Activities: {trip.activities?.join(", ")}</p>

      <div className="mt-auto flex gap-2 pt-2">
        <button
          onClick={() => setIsModalOpen(true)} // 👈 open modal
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          View Details
        </button>
         <TripDetailModal
        trip={trip}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 👈 close modal
      />
        {/* <button
          onClick={() => onJoin(trip._id)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Join Trip
        </button> */}
        <button
          onClick={() => router.push(`/?tab=messages&userId=${creator._id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Message
        </button>
      </div>
    </div>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function BuddiesTab({ tripId }) {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   console.log("trip id from ", tripId)

//   useEffect(() => {
//     if (!tripId) return; // do nothing if no tripId yet

//     const fetchMatches = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `http://localhost:4000/api/match/${tripId}`,
//           { withCredentials: true }
//         );
//         setMatches(data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.error || 'Failed to load matches');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatches();
//   }, [tripId]);

//   const handleJoinTrip = async (matchTripId) => {
//     try {
//       await axios.post(
//         `http://localhost:4000/api/trips/${matchTripId}/join`,
//         {},
//         { withCredentials: true }
//       );
//       alert('Requested to join the trip!');
//     } catch (err) {
//       alert(err.response?.data?.error || 'Failed to join trip');
//     }
//   };

//   const handleMessage = (creatorId) => {
//     router.push(`/chat/${creatorId}`);
//   };

//   if (loading) return <p>Loading matches...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!matches.length) return <p>No matching trips found.</p>;

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto">
//       {matches.map((trip) => (
//         <div key={trip._id} className="border rounded p-4 shadow flex flex-col">
//           <img
//             src={trip.imageUrl || '/default-trip.jpg'}
//             alt={trip.destination}
//             className="w-full h-40 object-cover rounded mb-2"
//           />
//           <h3 className="font-bold text-lg">{trip.destination}</h3>
//           <p>By: {trip.creator.name}</p>
//           <p>
//             Dates: {new Date(trip.startDate).toLocaleDateString()} -{' '}
//             {new Date(trip.endDate).toLocaleDateString()}
//           </p>
//           <p>Budget: {trip.budget}</p>
//           <p>Travel Style: {trip.travelStyle?.join(', ')}</p>
//           <p>Activities: {trip.activities?.join(', ')}</p>

//           <div className="mt-auto flex gap-2 pt-2">
//             <button
//               onClick={() => router.push(`/profile/${trip.creator._id}`)}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//             >
//               View Profile
//             </button>

//             <button
//               onClick={() => handleJoinTrip(trip._id)}
//               className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//             >
//               Join Trip
//             </button>

//             <button
//               onClick={() => handleMessage(trip.creator._id)}
//               className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
//             >
//               Message
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
