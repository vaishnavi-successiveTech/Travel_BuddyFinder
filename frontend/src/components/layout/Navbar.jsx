// "use client";

//
// import { X } from "lucide-react";

// const Navbar = ({ onToggleSidebar }) => {
//   return (
//     <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
//         {/* Left: Sidebar toggle */}
//         <button
//           onClick={onToggleSidebar}
//           className="mr-4 md:hidden text-white hover:text-gray-200"
//         >
//           <X className="h-6 w-6" />
//         </button>

//         {/* Logo */}
//         <div className="text-2xl font-bold">TravelBuddy</div>

//         {/* Right: Profile / Logout */}
//         <nav className="flex items-center space-x-4">
//           <button className="hover:bg-emerald-500 px-3 py-1 rounded">Profile</button>
//           <button className="hover:bg-emerald-500 px-3 py-1 rounded">Logout</button>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
"use client";
import { useRouter } from "next/navigation";
 import React from "react";



const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Remove token from localStorage (if you store JWT there)
    localStorage.removeItem("token");

    // 2. Optionally, remove cookies if used
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // 3. Redirect to login page
    router.push("/");
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

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <button
                 onClick={handleLogout}
                className="px-4 py-2 bg-yellow-300 text-emerald-600 font-semibold rounded-lg shadow hover:bg-gray-100"
              >
                Logout
              </button>
             
            </div>
          </div>
        </div>
      </header>
  );
};

export default Navbar;


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

// const sidebarItems = [
//   { icon: Search, label: "Discover", id: "discover", href: "/discover" },
//   { icon: Plus, label: "Create Trip", id: "create-trip", href: "/create-trip" },
//   { icon: Calendar, label: "My Trips", id: "my-trips", href: "/trips" },
//   { icon: Users, label: "My Buddies", id: "buddies", href: "/buddies" },
//   { icon: MessageSquare, label: "Messages", id: "messages", href: "/messages" },
//   { icon: Crown, label: "Premium", id: "premium", href: "/premium" },
//   { icon: Settings, label: "Settings", id: "settings", href: "/settings" },
// ];

// export default function Sidebar({ closeSidebar }) {
//   return (
//     <aside className="h-full w-64 bg-emerald-50 shadow-xl flex flex-col animate-slideIn">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//         <h2 className="text-lg font-bold text-gray-800">Menu</h2>
//         <button
//           onClick={closeSidebar}
//           className="p-2 rounded-lg hover:bg-yellow-300 hover:text-gray-900 transition-colors"
//         >
//           <X className="h-5 w-5 text-gray-800" />
//         </button>
//       </div>

//       {/* Menu List */}
//       <ul className="flex-1 p-4 space-y-2">
//         {sidebarItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <li key={item.id}>
//               <a
//                 href={item.href}
//                 className="flex items-center w-full px-4 py-2 rounded-lg text-gray-800 hover:bg-yellow-300 hover:text-gray-900 transition-colors"
//                 onClick={closeSidebar} // auto-close when clicked
//               >
//                 <Icon className="h-5 w-5 mr-3" />
//                 {item.label}
//               </a>
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
