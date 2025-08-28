'use client';

import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/pages/LandingPage';
import Dashboard from '@/components/pages/Dashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Dashboard /> : <LandingPage />;
}

// // src/app/page.jsx
// "use client";
// import LandingPage from "@/components/pages/LandingPage";
// import { useEffect, useState } from "react";
// const text = "Buddy Traveller";

// export default function HomePage() {
//   const [key, setKey] = useState(0);

//   useEffect(() => {
//     const totalDuration = text.length * 80 + 2000; // 80ms per letter + 2s pause
//     const interval = setInterval(() => {
//       setKey((k) => k + 1); // re-render to restart animation
//     }, totalDuration);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div>
//       <div className="text-center mt-10">
//         <style>
//           {`
//           @keyframes fadeInLetter {
//             from { opacity: 0; transform: translateY(10px);}
//             to { opacity: 1; transform: translateY(0);}
//           }
//           .letter {
//             display: inline-block;
//             opacity: 0;
//             animation: fadeInLetter 0.4s forwards;
//           }
//         `}
//         </style>
//         <h1 className="text-4xl font-bold text-green-400">
//           Welcome to{" "}
//           <span key={key}>
//             {text.split("").map((char, i) => (
//               <span
//                 className="letter"
//                 key={i}
//                 style={{ animationDelay: `${i * 0.08}s` }}
//               >
//                 {char === " " ? "\u00A0" : char}
//               </span>
//             ))}
//             <span className="inline-block ml-2">🐢</span>
//           </span>
//         </h1>
//         <p className="text-gray-300 mt-4">
//           Find travel buddies, invite travelers, and explore the world together!
//         </p>
//       </div>
//       <LandingPage />
//     </div>
//   );
// }
