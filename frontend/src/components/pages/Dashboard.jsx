'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DiscoverTab from '@/components/tabs/DiscoverTab';
import CreateTripTab from '@/components/tabs/CreateTripTab';
import MyTripsTab from '@/components/tabs/MyTripsTab';
import BuddiesTab from '@/components/tabs/BuddiesTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import PremiumTab from '@/components/tabs/PremiumTab';
import SettingsTab from '@/components/tabs/SettingsTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('discover');

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverTab />;
      case 'create-trip':
        return <CreateTripTab />;
      case 'my-trips':
        return <MyTripsTab />;
      case 'buddies':
        return <BuddiesTab />;
      case 'messages':
        return <MessagesTab />;
      case 'premium':
        return <PremiumTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DiscoverTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}