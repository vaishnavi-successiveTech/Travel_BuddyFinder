"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa"; // Add icons for buttons

export default function MyTripsTab() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [selectedTrip, setSelectedTrip] = useState(null); // Selected trip details
  const [isEditing, setIsEditing] = useState(false); // State to handle editing mode
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips/mine", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTrips(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch trips");
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip); // Set the selected trip details
    setModalOpen(true); // Open the modal
    setIsEditing(false); // Ensure editing is off when viewing details
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal
    setSelectedTrip(null); // Clear selected trip details
    setIsEditing(false); // Reset editing mode
  };

  const handleDeleteTrip = async () => {
    try {
      // Call API to delete the trip
      await api.delete(`/trips/${selectedTrip._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setModalOpen(false); // Close modal after deletion
      setTrips(trips.filter((trip) => trip._id !== selectedTrip._id)); // Remove the trip from the list
    } catch (err) {
      setError("Failed to delete trip");
    }
  };

  const handleUpdateTrip = async () => {
    try {
      // API call to update the trip details
      const updatedTrip = { ...selectedTrip }; // Assuming selectedTrip has the updated fields
      await api.patch(`/trips/${selectedTrip._id}`, updatedTrip, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTrips(
        trips.map((trip) =>
          trip._id === selectedTrip._id ? { ...trip, ...updatedTrip } : trip
        )
      );
      setModalOpen(false); // Close modal after updating
    } catch (err) {
      setError("Failed to update trip");
    }
  };

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Trips</h2>
      <p className="text-gray-600 mb-4">
        View and manage your planned or past trips.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length === 0 ? (
          <p>No trips found. Start creating one!</p>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="relative">
                <img
                  src={trip.imageUrl || "/default-trip-image.jpg"}
                  alt={trip.destination}
                  className="w-full h-56 object-cover rounded-lg"
                />
                {/* <div className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-full">
                  {trip.budget} 
                </div> */}
              </div>

              <h3 className="text-lg font-semibold mt-4">{trip.destination}</h3>
              <p className="text-sm text-gray-600">{`${new Date(
                trip.startDate
              ).toLocaleDateString()} - ${new Date(
                trip.endDate
              ).toLocaleDateString()}`}</p>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {trip.activities.join(", ")}
                </span>
                <button
                  onClick={() => handleViewDetails(trip)} // Open the modal with trip details
                  className="bg-emerald-500 text-white py-2 px-6 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-all"
                >
                  <FaEye className="mr-2" /> View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[80%] md:w-[60%] h-[80vh] flex flex-col">
            {/* Top Half: Image */}
            <div className="h-[50%]">
              <img
                src={selectedTrip.imageUrl || "/default-trip-image.jpg"}
                alt={selectedTrip.destination}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Bottom Half: Trip Details */}
            <div className="h-[50%] flex flex-col justify-between p-4">
              {/* Centered Title */}
              <h3 className="text-3xl font-bold text-center mb-4">
                {selectedTrip.destination}
              </h3>
              {isEditing ? (
                // <div>
                //   {/* Editable fields */}
                //   <input
                //     type="text"
                //     value={selectedTrip.destination}
                //     onChange={(e) => setSelectedTrip({ ...selectedTrip, destination: e.target.value })}
                //     className="w-full p-2 mb-2 border rounded"
                //     placeholder="Update destination"
                //   />
                //   <textarea
                //     value={selectedTrip.description}
                //     onChange={(e) => setSelectedTrip({ ...selectedTrip, description: e.target.value })}
                //     className="w-full p-2 mb-2 border rounded"
                //     placeholder="Update description"
                //   />
                //   <input
                //     type="number"
                //     value={selectedTrip.budget}
                //     onChange={(e) => setSelectedTrip({ ...selectedTrip, budget: e.target.value })}
                //     className="w-full p-2 mb-2 border rounded"
                //     placeholder="Update budget"
                //   />
                //   {/* Add other fields for editing if needed */}
                // </div>
                <div className="max-h-[400px] overflow-y-auto space-y-2 p-2 border rounded">
                  {/* Destination */}
                  <input
                    type="text"
                    value={selectedTrip.destination || ""}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        destination: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Update destination"
                  />

                  {/* Budget */}
                  <select
                    value={selectedTrip.budget || "mid"}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        budget: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low</option>
                    <option value="mid">Mid</option>
                    <option value="high">High</option>
                  </select>

                  {/* Travel Style */}
                  <input
                    type="text"
                    value={selectedTrip.travelStyle?.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        travelStyle: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Update travel style (comma separated)"
                  />

                  {/* Activities */}
                  <input
                    type="text"
                    value={selectedTrip.activities?.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        activities: e.target.value
                          .split(",")
                          .map((a) => a.trim()),
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Update activities (comma separated)"
                  />

                  {/* Start Date */}
                  <input
                    type="date"
                    value={selectedTrip.startDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />

                  {/* End Date */}
                  <input
                    type="date"
                    value={selectedTrip.endDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />

                  {/* Open To Join */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTrip.openToJoin || false}
                      onChange={(e) =>
                        setSelectedTrip({
                          ...selectedTrip,
                          openToJoin: e.target.checked,
                        })
                      }
                    />
                    <span>Open to Join</span>
                  </label>

                  {/* Max Group Size */}
                  <input
                    type="number"
                    value={selectedTrip.maxGroupSize || 4}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        maxGroupSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Update max group size"
                  />

                  {/* Image URL */}
                  <input
                    type="text"
                    value={selectedTrip.imageUrl || ""}
                    onChange={(e) =>
                      setSelectedTrip({
                        ...selectedTrip,
                        imageUrl: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Update image URL"
                  />
                </div>
              ) : (
                <>
                  <p className="mb-2">{selectedTrip.description}</p>
                  <p className="mb-2">{`Start Date: ${new Date(
                    selectedTrip.startDate
                  ).toLocaleDateString()}`}</p>
                  <p className="mb-2">{`End Date: ${new Date(
                    selectedTrip.endDate
                  ).toLocaleDateString()}`}</p>
                  <p className="mb-2">{`Budget: ${selectedTrip.budget}`}</p>
                  <p className="mb-4">{`Activities: ${selectedTrip.activities.join(
                    ", "
                  )}`}</p>
                </>
              )}

              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  <FaEye className="mr-2" /> Close
                </button>
                {isEditing ? (
                  <button
                    onClick={handleUpdateTrip}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" /> Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)} // Switch to edit mode
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                )}
                <button
                  onClick={handleDeleteTrip}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import api from "@/lib/api";
// import { FaEye, FaTrash, FaEdit } from "react-icons/fa"; // Add icons for buttons

// export default function MyTripsTab() {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [modalOpen, setModalOpen] = useState(false); // Modal state
//   const [selectedTrip, setSelectedTrip] = useState(null); // Selected trip details
//   const [isEditing, setIsEditing] = useState(false); // State to handle editing mode
//   const router = useRouter(); // Initialize the router

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const response = await api.get("/trips/mine", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setTrips(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch trips");
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, []);

//   const handleViewDetails = (trip) => {
//     setSelectedTrip(trip); // Set the selected trip details
//     setModalOpen(true); // Open the modal
//     setIsEditing(false); // Ensure editing is off when viewing details
//   };

//   const closeModal = () => {
//     setModalOpen(false); // Close the modal
//     setSelectedTrip(null); // Clear selected trip details
//     setIsEditing(false); // Reset editing mode
//   };

//   const handleDeleteTrip = async () => {
//     try {
//       // Call API to delete the trip
//       await api.delete(`/trips/${selectedTrip._id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setModalOpen(false); // Close modal after deletion
//       setTrips(trips.filter((trip) => trip._id !== selectedTrip._id)); // Remove the trip from the list
//     } catch (err) {
//       setError("Failed to delete trip");
//     }
//   };

//   const handleUpdateTrip = async () => {
//     try {
//       // API call to update the trip details
//       const updatedTrip = { ...selectedTrip }; // Assuming selectedTrip has the updated fields
//       await api.put(`/trips/${selectedTrip._id}`, updatedTrip, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setTrips(
//         trips.map((trip) =>
//           trip._id === selectedTrip._id ? { ...trip, ...updatedTrip } : trip
//         )
//       );
//       setModalOpen(false); // Close modal after updating
//     } catch (err) {
//       setError("Failed to update trip");
//     }
//   };

//   if (loading) return <p>Loading trips...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Trips</h2>
//       <p className="text-gray-600 mb-4">
//         View and manage your planned or past trips.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {trips.length === 0 ? (
//           <p>No trips found. Start creating one!</p>
//         ) : (
//           trips.map((trip) => (
//             <div key={trip._id} className="bg-white p-4 rounded-lg shadow-md">
//               <div className="relative">
//                 <img
//                   src={trip.imageUrl || "/default-trip-image.jpg"}
//                   alt={trip.destination}
//                   className="w-full h-56 object-cover rounded-lg"
//                 />
//                 <div className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-full">
//                   {trip.budget} Budget
//                 </div>
//               </div>

//               <h3 className="text-lg font-semibold mt-4">{trip.destination}</h3>
//               <p className="text-sm text-gray-600">{`${new Date(
//                 trip.startDate
//               ).toLocaleDateString()} - ${new Date(
//                 trip.endDate
//               ).toLocaleDateString()}`}</p>

//               <div className="mt-3 flex justify-between items-center">
//                 <span className="text-sm text-gray-500">
//                   {trip.activities.join(", ")}
//                 </span>
//                 <button
//                   onClick={() => handleViewDetails(trip)} // Open the modal with trip details
//                   className="bg-emerald-500 text-white py-2 px-6 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-all"
//                 >
//                   <FaEye className="mr-2" /> View Details
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Modal */}
//       {modalOpen && selectedTrip && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[70%] md:w-[50%] flex">
//             {/* Left side: Image */}
//             <div className="flex-1 mr-4">
//               <img
//                 src={selectedTrip.imageUrl || "/default-trip-image.jpg"}
//                 alt={selectedTrip.destination}
//                 className="w-full h-60 object-cover rounded-lg"
//               />
//             </div>

//             {/* Right side: Trip Details */}
//             <div className="flex-1">
//               <h3 className="text-2xl font-bold mb-4">{selectedTrip.destination}</h3>
//               {isEditing ? (
//                 <div>
//                   {/* Editable fields */}
//                   <input
//                     type="text"
//                     value={selectedTrip.destination}
//                     onChange={(e) => setSelectedTrip({ ...selectedTrip, destination: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                     placeholder="Update destination"
//                   />
//                   <textarea
//                     value={selectedTrip.description}
//                     onChange={(e) => setSelectedTrip({ ...selectedTrip, description: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                     placeholder="Update description"
//                   />
//                   <input
//                     type="number"
//                     value={selectedTrip.budget}
//                     onChange={(e) => setSelectedTrip({ ...selectedTrip, budget: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                     placeholder="Update budget"
//                   />
//                   {/* Add other fields for editing if needed */}
//                 </div>
//               ) : (
//                 <>
//                   <p className="mb-2">{selectedTrip.description}</p>
//                   <p className="mb-2">{`Start Date: ${new Date(selectedTrip.startDate).toLocaleDateString()}`}</p>
//                   <p className="mb-2">{`End Date: ${new Date(selectedTrip.endDate).toLocaleDateString()}`}</p>
//                   <p className="mb-2">{`Budget: ${selectedTrip.budget}`}</p>
//                   <p className="mb-4">{`Activities: ${selectedTrip.activities.join(", ")}`}</p>
//                 </>
//               )}

//               <div className="flex justify-between">
//                 <button
//                   onClick={closeModal}
//                   className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
//                 >
//                   <FaEye className="mr-2" /> Close
//                 </button>
//                 {isEditing ? (
//                   <button
//                     onClick={handleUpdateTrip}
//                     className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
//                   >
//                     <FaEdit className="mr-2" /> Save Changes
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => setIsEditing(true)} // Switch to edit mode
//                     className="bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
//                   >
//                     <FaEdit className="mr-2" /> Edit
//                   </button>
//                 )}
//                 <button
//                   onClick={handleDeleteTrip}
//                   className="bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
//                 >
//                   <FaTrash className="mr-2" /> Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import api from "@/lib/api";

// export default function MyTripsTab() {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter(); // Initialize the router

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const response = await api.get("/trips/mine", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setTrips(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch trips");
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, []);

//   const handleViewDetails = (tripId) => {
//     router.push(`/trips/${tripId}`); // Navigate to the dynamic trip detail page
//     console.log("trip  my id", tripId);
//   };

//   if (loading) return <p>Loading trips...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Trips</h2>
//       <p className="text-gray-600 mb-4">
//         View and manage your planned or past trips.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {trips.length === 0 ? (
//           <p>No trips found. Start creating one!</p>
//         ) : (
//           trips.map((trip) => (
//             <div key={trip._id} className="bg-white p-4 rounded-lg shadow-md">
//               <div className="relative">
//                 <img
//                   src={trip.imageUrl || "/default-trip-image.jpg"}
//                   alt={trip.destination}
//                   className="w-full h-56 object-cover rounded-lg"
//                 />
//                 <div className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-full">
//                   {trip.budget} Budget
//                 </div>
//               </div>

//               <h3 className="text-lg font-semibold mt-4">{trip.destination}</h3>
//               <p className="text-sm text-gray-600">{`${new Date(
//                 trip.startDate
//               ).toLocaleDateString()} - ${new Date(
//                 trip.endDate
//               ).toLocaleDateString()}`}</p>

//               <div className="mt-3 flex justify-between items-center">
//                 <span className="text-sm text-gray-500">
//                   {trip.activities.join(", ")}
//                 </span>
//                 <button
//                   onClick={() => handleViewDetails(trip)} // Trigger navigation
//                   className="bg-emerald-500 text-white py-1 px-4 rounded-lg cursor-pointer hover:bg-emerald-600 transition-all"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// // "use client";
// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useRouter } from "next/navigation";
// // import api from "@/lib/api";

// // export default function MyTripsTab() {
// //   const [trips, setTrips] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const router = useRouter(); // Initialize the router

// //   useEffect(() => {
// //     const fetchTrips = async () => {
// //       try {
// //         const response = await api.get("/trips/mine", {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         });
// //         setTrips(response.data);
// //         setLoading(false);
// //       } catch (err) {
// //         setError("Failed to fetch trips");
// //         setLoading(false);
// //       }
// //     };

// //     fetchTrips();
// //   }, []);

// //   if (loading) return <p>Loading trips...</p>;
// //   if (error) return <p>{error}</p>;

// //   const handleViewDetails = (tripId) => {
// //     router.push(`/trips/${trips._id}`); // Navigate to trip details page
// //   };

// //   return (
// //     <div>
// //       <h2 className="text-2xl font-bold mb-4">My Trips</h2>
// //       <p className="text-gray-600 mb-4">
// //         View and manage your planned or past trips.
// //       </p>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {trips.length === 0 ? (
// //           <p>No trips found. Start creating one!</p>
// //         ) : (
// //           trips.map((trip) => (
// //             <div key={trip._id} className="bg-white p-4 rounded-lg shadow-md">
// //               <div className="relative">
// //                 <img
// //                   src={trip.imageUrl || "/default-trip-image.jpg"}
// //                   alt={trip.destination}
// //                   className="w-full h-56 object-cover rounded-lg"
// //                 />
// //                 <div className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-full">
// //                   {trip.budget} Budget
// //                 </div>
// //               </div>

// //               <h3 className="text-lg font-semibold mt-4">{trip.destination}</h3>
// //               <p className="text-sm text-gray-600">{`${new Date(
// //                 trip.startDate
// //               ).toLocaleDateString()} - ${new Date(
// //                 trip.endDate
// //               ).toLocaleDateString()}`}</p>

// //               <div className="mt-3 flex justify-between items-center">
// //                 <span className="text-sm text-gray-500">
// //                   {trip.activities.join(", ")}
// //                 </span>
// //                 <button
// //                   onClick={() => router.push(`/trips/${trip._id}`)} // Navigate to the trip detail page
// //                   className="bg-emerald-500 text-white py-1 px-4 rounded-lg"
// //                 >
// //                   View Details
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
