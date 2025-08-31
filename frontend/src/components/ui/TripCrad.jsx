"use client";
import { useRouter } from "next/navigation";

export default function TripCard({ trip }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/trips/${trip._id}`);  // Navigate to the trip details page
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={trip.imageUrl || "/default-trip-image.jpg"}  // Show image if available
        alt={trip.destination}
        className="w-full h-56 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-4">{trip.destination}</h3>
      <p className="text-sm text-gray-600">{`${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`}</p>
      <div className="mt-3 flex justify-between items-center">
        <button onClick={handleViewDetails} className="bg-emerald-500 text-white py-1 px-4 rounded-lg">
          View Details
        </button>
      </div>
    </div>
  );
}

// "use client";
// import { useRouter } from "next/navigation";

// export default function TripCard({ trip }) {
//   const router = useRouter();

//   const handleViewDetails = () => {
//     router.push(`/trips/${trip._id}`);  // Navigate to the trip details page
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <img
//         src={trip.imageUrl || "/default-trip-image.jpg"}
//         alt={trip.destination}
//         className="w-full h-56 object-cover rounded-lg"
//       />
//       <h3 className="text-lg font-semibold mt-4">{trip.destination}</h3>
//       <p className="text-sm text-gray-600">{`${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`}</p>
//       <div className="mt-3 flex justify-between items-center">
//         <button onClick={handleViewDetails} className="bg-emerald-500 text-white py-1 px-4 rounded-lg">
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// }
