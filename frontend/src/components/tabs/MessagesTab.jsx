"use client";
import { useQuery } from "@apollo/client/react"; 
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatWindow from "./ChatWindow";
import gql from "graphql-tag";
import LoadingSpinner from "../ui/LoadingSpinner";

const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      name
      email
      avatar
    }
  }
`;

export default function MessagesTab() {
  const { data, loading, error } = useQuery(GET_USERS);
  const router = useRouter();
  const searchParams = useSearchParams();

  const userIdFromUrl = searchParams.get("userId"); 
  const [selectedUser, setSelectedUser] = useState(null);

  // Preselect user if userId is in URL
  useEffect(() => {
    if (userIdFromUrl && data?.users) {
      const user = data.users.find((u) => u._id === userIdFromUrl);
      if (user) setSelectedUser(user);
    }
  }, [userIdFromUrl, data]);

  if (loading) return <LoadingSpinner />;;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data?.users) return <p>No users found.</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden sm:flex" : "flex"
        } w-full sm:w-1/3 border-r bg-gray-50 flex-col`}
      >
        <h2 className="text-xl font-bold p-4 border-b">Chats</h2>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {data.users.map((user) => (
            <div
              key={user._id}
              className={`flex items-center gap-3 p-3 rounded-xl shadow cursor-pointer hover:bg-emerald-100 ${
                selectedUser?._id === user._id ? "bg-emerald-200" : ""
              }`}
              onClick={() => {
                setSelectedUser(user);
                router.replace(`/?tab=messages&userId=${user._id}`); // update URL without reload
              }}
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full border object-cover"
              />
              <p className="font-semibold">{user.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          selectedUser ? "flex" : "hidden sm:flex"
        } w-full sm:w-2/3`}
      >
        {selectedUser ? (
          <div className="w-full h-full flex flex-col">
            {/* Mobile back button */}
            <div className="sm:hidden p-2 border-b bg-gray-100">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  router.replace("/?tab=messages"); // 👈 clear userId from URL
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ← Back
              </button>
            </div>
            <ChatWindow recipient={selectedUser} />
          </div>
        ) : (
          <div className="hidden sm:flex h-full w-full items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}


// "use client";
// import { useQuery } from "@apollo/client/react"; 
// import { useState } from "react";
// import ChatWindow from "./ChatWindow";
// import gql from "graphql-tag";

// const GET_USERS = gql`
//   query GetUsers {
//     users {
//       _id
//       name
//       email
//       avatar
//     }
//   }
// `;

// export default function MessageTab() {
//   const { data, loading, error } = useQuery(GET_USERS);
//   const [selectedUser, setSelectedUser] = useState(null);
  // const searchParams = useSearchParams();
  // const userIdFromUrl = searchParams.get("userId"); // 👈 get userId from URL
// useEffect(() => {

//     if (userIdFromUrl && data?.users) {
//       const user = data.users.find((u) => u._id === userIdFromUrl);
//       if (user) setSelectedUser(user);
//     }
//   }, [userIdFromUrl, data]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">Error: {error.message}</p>;
//   if (!data?.users) return <p>No users found.</p>;

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div
//         className={`${
//           selectedUser ? "hidden sm:flex" : "flex"
//         } w-full sm:w-1/3 border-r bg-gray-50 flex-col`}
//       >
//         {/* Fixed Header */}
//         <h2 className="text-xl font-bold p-4 border-b">Chats</h2>

//         {/* Scrollable user list */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-2">
//           {data.users.map((user) => (
//             <div
//               key={user._id}
//               className={`flex items-center gap-3 p-3 rounded-xl shadow cursor-pointer hover:bg-emerald-100 ${
//                 selectedUser?._id === user._id ? "bg-emerald-200" : ""
//               }`}
//               onClick={() => setSelectedUser(user)}
//             >
//               <img
//                 src={user.avatar || "/default-avatar.png"}
//                 alt={user.name}
//                 className="w-10 h-10 rounded-full border object-cover"
//               />
//               <p className="font-semibold">{user.name}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div
//         className={`${
//           selectedUser ? "flex" : "hidden sm:flex"
//         } w-full sm:w-2/3`}
//       >
//         {selectedUser ? (
//           <div className="w-full h-full flex flex-col">
//             {/* Mobile back button */}
//             <div className="sm:hidden p-2 border-b bg-gray-100">
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
//               >
//                 ← Back
//               </button>
//             </div>

//             {/* Chat content */}
//             <ChatWindow recipient={selectedUser} />
//           </div>
//         ) : (
//           <div className="hidden sm:flex h-full w-full items-center justify-center text-gray-500">
//             Select a user to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
