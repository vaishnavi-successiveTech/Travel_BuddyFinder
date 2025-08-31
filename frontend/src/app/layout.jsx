// import './globals.css';
// import { AuthProvider } from '@/context/AuthContext';
// import Navbar from '@/components/layout/Navbar';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-950 text-gray-100">
//         <AuthProvider>
//           <Navbar />
//           <main className="p-6">{children}</main>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "sonner";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
 // ✅ import correctly

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Travel Buddy Finder",
  description: "Find your perfect travel companion for unforgettable adventures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <AuthProvider>
          <AppProvider>
            
            <Providers>
            <NotificationsProvider>
            {children}
          </NotificationsProvider>
              <Toaster position="top-right" />
            </Providers>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


// 'use client'
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import './globals.css';

// export default function RootLayout({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   const handleAuthClick = () => {
//     if (isLoggedIn) {
//       setIsLoggedIn(false);
//       alert("Logged out!");
//     } else {
//       router.push("/login"); // ✅ Redirect to login page
//     }
//   };

//   return (
//     <html lang="en">
//       <body className="bg-gray-950 text-gray-100">
//         <nav className="flex items-center justify-between px-6 py-3 bg-gray-900 shadow-md">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <img src="/image/logo.png" alt="Logo" className="h-8 w-8" />
//             <span className="text-green-500 font-bold text-xl">BuddyTraveler</span>
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center space-x-6 font-medium">
//             <a href="#" className="hover:text-green-400 transition-colors">FIND A TRAVEL BUDDY</a>
//             <a href="#" className="hover:text-green-400 transition-colors">INVITE TRAVELERS</a>
//             <a href="#" className="hover:text-green-400 transition-colors">ONLINE NOW</a>

//             {/* Auth Buttons */}
//             {!isLoggedIn ? (
//               <button
//                 onClick={handleAuthClick}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition"
//               >
//                 LOGIN
//               </button>
//             ) : (
//               <button
//                 onClick={handleAuthClick}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
//               >
//                 LOGOUT
//               </button>
//             )}

            
//             <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow">
//               U
//             </div>
//           </div>
//         </nav>

//         <main className="p-6">{children}</main>
//       </body>
//     </html>
//   );
// }
