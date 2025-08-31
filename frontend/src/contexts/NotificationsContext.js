// context/NotificationsContext.jsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSubscription } from '@apollo/client/react';
import gql from 'graphql-tag';
// If you have an AuthContext that exposes the logged-in user:
import { useAuth } from '@/contexts/AuthContext';

export const NEW_USER_SUBSCRIPTION = gql`
  subscription OnNewUser {
    newUser {
      _id
      name
      email
      gender
    }
  }
`;

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth?.() || {};
  const storageKey = `tb:dismissed:newuser:${user?._id || 'anon'}`;

  // Raw events coming from subscription (append-only)
  const [events, setEvents] = useState([]);

  // Locally dismissed ids, persisted per user/session
  const [dismissedIds, setDismissedIds] = useState(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(saved);
    } catch {
      return new Set();
    }
  });

  // Re-load dismissed ids when user changes (i.e., storageKey changes)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setDismissedIds(new Set(saved));
    } catch {
      setDismissedIds(new Set());
    }
  }, [storageKey]);

  // Persist dismissed ids
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify([...dismissedIds]));
  }, [dismissedIds, storageKey]);

  // Subscribe to new-user events
  const { data: subscriptionData } = useSubscription(NEW_USER_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData?.newUser) {
      setEvents(prev => {
        // avoid duplicates
        if (prev.some(e => e._id === subscriptionData.newUser._id)) return prev;
        return [subscriptionData.newUser, ...prev];
      });
    }
  }, [subscriptionData]);

  // Visible notifications = events not dismissed
  const notifications = useMemo(
    () => events.filter(e => !dismissedIds.has(e._id)),
    [events, dismissedIds]
  );

  const dismissNotification = (id) => {
    setDismissedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const clearAllNotifications = () => {
    setDismissedIds(prev => {
      const next = new Set(prev);
      events.forEach(e => next.add(e._id));
      return next;
    });
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,          // already filtered (visible only)
        dismissNotification,    // hide locally
        clearAllNotifications,  // hide all locally
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
};
