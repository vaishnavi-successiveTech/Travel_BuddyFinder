// 'use client';

// import React from 'react';

// const tabs = [
//   { id: 'discover', label: 'Discover' },
//   { id: 'create-trip', label: 'Create Trip' },
//   { id: 'my-trips', label: 'My Trips' },
//   { id: 'buddies', label: 'Buddies' },
//   { id: 'messages', label: 'Messages' },
//   { id: 'premium', label: 'Premium' },
//   { id: 'settings', label: 'Settings' },
// ];

// const Sidebar = ({ activeTab, onTabChange }) => {
//   return (
//     <aside className="w-60 bg-white shadow-md min-h-screen p-4">
//       <ul className="space-y-2">
//         {tabs.map((tab) => (
//           <li key={tab.id}>
//             <button
//               onClick={() => onTabChange(tab.id)}
//               className={`w-full text-left px-4 py-2 rounded hover:bg-emerald-100 ${
//                 activeTab === tab.id ? 'bg-emerald-200 font-semibold' : ''
//               }`}
//             >
//               {tab.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;
"use client";

import api from "@/lib/api";
import {
  Search,
  Plus,
  Calendar,
  Users,
  MessageSquare,
  Crown,
  Settings,
  X,
  Menu as MenuIcon,
  User2,
  User,
  UsbIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";


import { useState } from "react";

const sidebarItems = [
  { icon: Search, label: "Discover", id: "discover" },
  { icon: Plus, label: "Create Trip", id: "create-trip" },
  { icon: Calendar, label: "My Trips", id: "my-trips" },
  { icon: Users, label: "My Travel Buddies", id: "buddies" },
  { icon: User, label: "Complete Profile", id: "complete" }, // ✅ new tab
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon:UsbIcon,label:"Fiends",id:"friends"},
  // { icon: Crown, label: "Premium", id: "premium" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
   const Logout = async () => {
  

    try {
      // Call backend logout API
      await api.post("/auth/logout");

      // Optionally, clear any client-side auth data (localStorage / cookies)
      localStorage.removeItem("token");

      // Redirect to login page
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
    }
  };
  return (
    <aside
      className={`hidden md:flex md:flex-col min-h-screen bg-emerald-50 shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        {!collapsed && (
          <h2 className="text-lg font-bold text-gray-800 text-center flex-1">
            Menu
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-800 hover:text-gray-600"
        >
          {collapsed ? (
            <MenuIcon className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Menu List */}
      <ul className="flex-1 p-2 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full px-2 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-800 hover:bg-yellow-300 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer CTA */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-emerald-600 transition"
            onClick={Logout}
          >
            LogOut
          </button>
        </div>
      )}
    </aside>
  );
}

// "use client";

// import {
//   Search,
//   Plus,
//   Calendar,
//   Users,
//   MessageSquare,
//   Crown,
//   Settings,
//   X,
// } from "lucide-react";
// import { useState } from "react";

// const sidebarItems = [
//   { icon: Search, label: "Discover", id: "discover" },
//   { icon: Plus, label: "Create Trip", id: "create-trip" },
//   { icon: Calendar, label: "My Trips", id: "my-trips" },
//   { icon: Users, label: "My Buddies", id: "buddies" },
//   { icon: MessageSquare, label: "Messages", id: "messages" },
//   { icon: Crown, label: "Premium", id: "premium" },
//   { icon: Settings, label: "Settings", id: "settings" },
// ];

// export default function Sidebar({ activeTab, onTabChange }) {
//   const [isOpen, setIsOpen] = useState(true);

//   if (!isOpen) return null; // Hide sidebar when closed

//   return (
//     <aside className="hidden md:flex md:flex-col w-64 bg-emerald-50 shadow-xl h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//         <h2 className="text-lg font-bold text-gray-800 text-center flex-1">
//           Menu
//         </h2>
//         <button
//           onClick={() => setIsOpen(false)}
//           className="text-gray-800 hover:text-red-500"
//         >
//           <X className="h-5 w-5" />
//         </button>
//       </div>

//       {/* Menu List */}
//       <ul className="flex-1 p-4 space-y-2">
//         {sidebarItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = activeTab === item.id;
//           return (
//             <li key={item.id}>
//               <button
//                 onClick={() => onTabChange(item.id)}
//                 className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-emerald-500 text-white"
//                     : "text-gray-800 hover:bg-yellow-300 hover:text-gray-900"
//                 }`}
//               >
//                 <Icon className="h-5 w-5 mr-3" />
//                 {item.label}
//               </button>
//             </li>
//           );
//         })}
//       </ul>

//       {/* Footer CTA */}
//       <div className="p-4 border-t border-gray-200">
//         <button className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-emerald-600 transition">
//           Upgrade to Premium
//         </button>
//       </div>
//     </aside>
//   );
// }
