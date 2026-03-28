"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import DiscoverTab from "@/components/tabs/DiscoverTab";
import CreateTripTab from "@/components/tabs/CreateTripTab";
import MyTripsTab from "@/components/tabs/MyTripsTab";
import BuddiesTab from "@/components/tabs/BuddiesTab";
import MessagesTab from "@/components/tabs/MessagesTab";
import PremiumTab from "@/components/tabs/PremiumTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import CompleteProfileForm from "../tabs/CompleteProfile";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const [currentTripId, setCurrentTripId] = useState(null);
  const searchParams = useSearchParams();
     const tabFromUrl = searchParams.get("tab") ||"discover";

  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);


  // Fetch the user's current trip to pass its ID to BuddiesTab
 useEffect(() => {
  const fetchCurrentTrip = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/trips/current", {
        credentials: "include",
      });
      const trip = await res.json();

      if (trip?._id) setCurrentTripId(trip._id);
      console.log("Fetched trip ID from API:", trip?._id);
    } catch (err) {
      console.error("Failed to fetch current trip:", err);
    }
  };

  fetchCurrentTrip();
}, []);


  const renderContent = () => {
    switch (activeTab) {
      case "discover":
        return <DiscoverTab />;
      case "complete":
        return <CompleteProfileForm />;
      case "create-trip":
        return <CreateTripTab />;
      case "my-trips":
        return <MyTripsTab />;
      case "buddies":
        return <BuddiesTab tripId={currentTripId} />;
      case "messages":
        return <MessagesTab />;
      case "premium":
        return <PremiumTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DiscoverTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8 pl-16 pt-16 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
