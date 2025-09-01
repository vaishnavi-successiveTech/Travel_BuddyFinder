


"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";
import axios from "axios";

import { useSubscription } from "@apollo/client/react";
const Navbar = () => {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const { notifications, dismissNotification, clearAllNotifications } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, [setUser]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/image/logo.png"
              alt="Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold">Buddy Traveller</h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3 relative">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full hover:bg-emerald-500"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white"></span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="text-sm font-medium">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className="flex justify-between items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-50 text-sm"
                      >
                        <span>
                          {n.type === 'user' && '🟦 '}
                          {n.type === 'trip' && '🟩 '}
                          {n.type === 'message' && '🟪 '}
                          {n.text}
                        </span>
                        <button
                          onClick={() => dismissNotification(n._id)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={user?.avatar || '/image/default-avatar.png'}
                  alt="User Avatar"
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => router.push('/myProfile')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// const Navbar = () => {
//   const router = useRouter();
//   const { user, setUser, logout } = useAuth(); // make sure AuthContext exposes setUser
//   const { notifications, dismissNotification, clearAllNotifications } =
//     useNotifications();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   // ✅ Fetch latest user when Navbar mounts
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await axios.get("http://localhost:4000/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(res.data); // update global user in AuthContext
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [setUser]);

//   const handleLogout = () => {
//     logout();
//     router.push("/");
//   };

//   return (
//     <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
//       <div className="w-full px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16 w-full">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <img
//               src="/image/logo.png"
//               alt="Logo"
//               className="h-8 w-8 rounded-full object-cover"
//             />
//             <h1 className="text-xl font-bold">Buddy Traveller</h1>
//           </div>

//           {/* Right actions */}
//           <div className="flex items-center space-x-3 relative">
//             {/* Bell Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 className="relative p-2 rounded-full hover:bg-emerald-500"
//                 aria-label="Notifications"
//               >
//                 <Bell className="h-6 w-6 text-white" />
//                 {notifications.length > 0 && (
//                   <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white"></span>
//                 )}
//               </button>

//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
//                   <div className="flex items-center justify-between px-3 py-2 border-b">
//                     <span className="text-sm font-medium">Notifications</span>
//                     {notifications.length > 0 && (
//                       <button
//                         onClick={clearAllNotifications}
//                         className="text-xs px-2 py-1 rounded hover:bg-gray-100"
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>

//                   {notifications.length === 0 ? (
//                     <p className="p-3 text-sm text-gray-500">
//                       No notifications
//                     </p>
//                   ) : (
//                     notifications.map((n) => (
//                       <div
//                         key={n._id}
//                         className="flex justify-between items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-50 text-sm"
//                       >
//                         <span>
//                           New user registered: <b>{n.name}</b> ({n.email})
//                         </span>
//                         <button
//                           onClick={() => dismissNotification(n._id)}
//                           className="ml-2 text-gray-400 hover:text-red-500"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* User Avatar Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowUserMenu(!showUserMenu)}
//                 className="flex items-center focus:outline-none"
//               >
//                 <img
//                   src={user?.avatar || "/image/default-avatar.png"}
//                   alt="User Avatar"
//                   className="h-9 w-9 rounded-full border-2 border-white object-cover"
//                 />
//               </button>

//               {showUserMenu && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
//                   <button
//                     onClick={() => router.push("/myProfile")}
//                     className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     My Profile
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

