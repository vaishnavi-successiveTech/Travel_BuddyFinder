'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { mockTrips, mockUsers } from '@/lib/mockData';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [trips, setTrips] = useState(mockTrips);
  const [users, setUsers] = useState(mockUsers);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new matches found
      const randomMatch = {
        id: Date.now().toString(),
        type: 'match',
        title: 'New Travel Buddy Match!',
        message: 'Someone with similar interests wants to join your Japan trip',
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [randomMatch, ...prev.slice(0, 4)]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addTrip = (tripData) => {
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      createdBy: '1', // Current user
      spotsAvailable: tripData.spots
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  const joinTrip = (tripId) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, spotsAvailable: Math.max(0, trip.spotsAvailable - 1) }
        : trip
    ));
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const sendMessage = (recipientId, content) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: '1', // Current user
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const value = {
    trips,
    users,
    matches,
    notifications,
    messages,
    addTrip,
    joinTrip,
    markNotificationRead,
    sendMessage,
    setTrips,
    setUsers,
    setMatches
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}