"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function TripDetailsPage() {
  const router = useRouter();
  ;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tripId = router.params?.tripId;

  useEffect(() => {
    if (!tripId) return;

    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 5000, // 5-second timeout
        });
        setTrip(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again later.');
        } else {
          setError("Failed to fetch trip details");
        }
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (loading) return <LoadingSpinner />;;
  if (error) return <p>{error}</p>;
  if (!trip) return <p>Trip not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">{trip.destination}</h1>
      <p>{trip.description}</p>
      <p>{`Start Date: ${new Date(trip.startDate).toLocaleDateString()}`}</p>
      <p>{`End Date: ${new Date(trip.endDate).toLocaleDateString()}`}</p>
      <p>{`Budget: ${trip.budget}`}</p>
      <p>{`Activities: ${trip.activities.join(", ")}`}</p>
    </div>
  );
}


// 'use client';
// import Navbar from "@/components/layout/Navbar";
// import Sidebar from "@/components/layout/Sidebar";
// import { useState } from "react";
// import axios from "axios"; // Use axios for fetching data




// export async function getServerSideProps({ params }) {
//   const { tripId } = params; // Access the tripId from params
//   console.log("tripid",tripId);

//   try {
//     // Fetch trip details from the API using the tripId
//     const response = await axios.get(`http://localhost:4000/api/trips/${tripId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.TOKEN}`, // Or handle the token in a different way
//       },
//     });

//     // Return trip data as props
//     return { props: { trip: response.data } };
//   } catch (err) {
//     console.error(err);
//     return { props: { error: "Failed to fetch trip details" } }; // In case of error
//   }
// }

// export default function TripDetailsPage({ trip, error }) {
//   const [loading, setLoading] = useState(false);

//   if (loading) return <p>Loading trip details...</p>;
//   if (error) return <p>{error}</p>;
//   if (!trip) return <p>Trip not found</p>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="flex flex-1">
//         <Sidebar activeTab="my-trips" onTabChange={() => {}} />
//         <main className="flex-1 p-8 pl-16 pt-16 overflow-y-auto">
//           <div className="max-w-6xl mx-auto">
//             <h1 className="text-3xl font-bold mb-4">{trip.destination}</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <img
//                   src={trip.imageUrl || "/default-trip-image.jpg"}
//                   alt={trip.destination}
//                   className="w-full h-72 object-cover rounded-lg"
//                 />
//               </div>
//               <div>
//                 <p className="text-lg font-semibold">Trip Details</p>
//                 <p>{trip.description}</p>
//                 <p className="mt-3">
//                   <strong>Budget:</strong> {trip.budget}
//                 </p>
//                 <p>
//                   <strong>Start Date:</strong>{" "}
//                   {new Date(trip.startDate).toLocaleDateString()}
//                 </p>
//                 <p>
//                   <strong>End Date:</strong>{" "}
//                   {new Date(trip.endDate).toLocaleDateString()}
//                 </p>
//                 <p className="mt-3">
//                   <strong>Activities:</strong> {trip.activities.join(", ")}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
