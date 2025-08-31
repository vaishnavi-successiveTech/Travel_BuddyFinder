"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // 👈 store full user info (id, name, etc.)
  const router = useRouter();

  // 👇 Check token when app loads (even after refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData)); // load user object
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        localStorage.removeItem("user"); // cleanup bad value
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // 👈 save user in localStorage
    setIsLoggedIn(true);
    setUser(userData);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ removing user from localStorage
    setIsLoggedIn(false);
    setUser(null); // ✅ clear user state
    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setIsLoggedIn(true);
//   }, []);

//   const login = (token) => {
//     localStorage.setItem("token", token);
//     setIsLoggedIn(true);
//     router.push("/"); // ✅ Go to home after login
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     router.push("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
