// // context/NotificationsContext.jsx
// 'use client';

// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { useSubscription } from '@apollo/client/react';
// import gql from 'graphql-tag';
// // If you have an AuthContext that exposes the logged-in user:
// import { useAuth } from '@/contexts/AuthContext';

// export const NEW_USER_SUBSCRIPTION = gql`
//   subscription OnNewUser {
//     newUser {
//       _id
//       name
//       email
//       gender
//     }
//   }
// `;

// const NotificationsContext = createContext(null);

// export const NotificationsProvider = ({ children }) => {
//   const { user } = useAuth?.() || {};
//   const storageKey = `tb:dismissed:newuser:${user?._id || 'anon'}`;

//   // Raw events coming from subscription (append-only)
//   const [events, setEvents] = useState([]);

//   // Locally dismissed ids, persisted per user/session
//   const [dismissedIds, setDismissedIds] = useState(() => {
//     if (typeof window === 'undefined') return new Set();
//     try {
//       const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
//       return new Set(saved);
//     } catch {
//       return new Set();
//     }
//   });

//   // Re-load dismissed ids when user changes (i.e., storageKey changes)
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     try {
//       const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
//       setDismissedIds(new Set(saved));
//     } catch {
//       setDismissedIds(new Set());
//     }
//   }, [storageKey]);

//   // Persist dismissed ids
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     localStorage.setItem(storageKey, JSON.stringify([...dismissedIds]));
//   }, [dismissedIds, storageKey]);

//   // Subscribe to new-user events
//   const { data: subscriptionData } = useSubscription(NEW_USER_SUBSCRIPTION);

//   useEffect(() => {
//     if (subscriptionData?.newUser) {
//       setEvents(prev => {
//         // avoid duplicates
//         if (prev.some(e => e._id === subscriptionData.newUser._id)) return prev;
//         return [subscriptionData.newUser, ...prev];
//       });
//     }
//   }, [subscriptionData]);

//   // Visible notifications = events not dismissed
//   const notifications = useMemo(
//     () => events.filter(e => !dismissedIds.has(e._id)),
//     [events, dismissedIds]
//   );

//   const dismissNotification = (id) => {
//     setDismissedIds(prev => {
//       const next = new Set(prev);
//       next.add(id);
//       return next;
//     });
//   };

//   const clearAllNotifications = () => {
//     setDismissedIds(prev => {
//       const next = new Set(prev);
//       events.forEach(e => next.add(e._id));
//       return next;
//     });
//   };

//   return (
//     <NotificationsContext.Provider
//       value={{
//         notifications,          // already filtered (visible only)
//         dismissNotification,    // hide locally
//         clearAllNotifications,  // hide all locally
//       }}
//     >
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const ctx = useContext(NotificationsContext);
//   if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
//   return ctx;
// };

// context/NotificationsContext.jsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSubscription } from '@apollo/client/react';
import gql from 'graphql-tag';
import { useAuth } from '@/contexts/AuthContext';

export const NEW_USER_SUB = gql`
  subscription OnNewUser {
    newUser {
      _id
      name
      email
    }
  }
`;

export const TRIP_CREATED_SUB = gql`
  subscription OnTripCreated {
    tripCreated {
      _id
      destination
      creator {
        _id
        name
      }
    }
  }
`;

// export const MESSAGE_SENT_SUB = gql`
//   subscription OnMessageSent($recipient: ID!) {
//     messageSent(recipient: $recipient) {
//       _id
//       content
//       sender {
//         _id
//         name
//       }
//     }
//   }
// `;

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth?.() || {};
  const storageKey = `tb:dismissed:notifications:${user?._id || 'anon'}`;

  const [events, setEvents] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(saved);
    } catch {
      return new Set();
    }
  });

  // Persist dismissed IDs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify([...dismissedIds]));
  }, [dismissedIds, storageKey]);

  // Reload dismissed IDs when user changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setDismissedIds(new Set(saved));
    } catch {
      setDismissedIds(new Set());
    }
  }, [storageKey]);

  // Subscriptions
  const { data: newUserData } = useSubscription(NEW_USER_SUB);
  const { data: newTripData } = useSubscription(TRIP_CREATED_SUB);
  // const { data: messageData } = useSubscription(MESSAGE_SENT_SUB, {
  //   variables: { recipient: user?._id },
  //   skip: !user?._id,
  // });

  // Handle incoming subscription data
  useEffect(() => {
    if (newUserData?.newUser) {
      const n = newUserData.newUser;
      addNotification({
        _id: n._id,
        type: 'user',
        text: `New user: ${n.name} (${n.email})`,
      });
    }
  }, [newUserData]);

  useEffect(() => {
    if (newTripData?.tripCreated) {
      const t = newTripData.tripCreated;
      addNotification({
        _id: t._id,
        type: 'trip',
        text: `New trip by ${t.creator.name}: ${t.destination}`,
      });
    }
  }, [newTripData]);

  // useEffect(() => {
  //   if (messageData?.messageSent) {
  //     const m = messageData.messageSent;
  //     addNotification({
  //       _id: m._id,
  //       type: 'message',
  //       text: `New message from ${m.sender.name}: "${m.content}"`,
  //     });
  //   }
  // }, [messageData]);

  // Add notification
  const addNotification = (notif) => {
    setEvents((prev) => {
      if (prev.some((e) => e._id === notif._id)) return prev;
      return [notif, ...prev];
    });
  };

  // Dismiss single notification
  const dismissNotification = (id) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  // Dismiss all notifications
  const clearAllNotifications = () => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      events.forEach((e) => next.add(e._id));
      return next;
    });
  };

  // Visible notifications
  const notifications = useMemo(
    () => events.filter((e) => !dismissedIds.has(e._id)),
    [events, dismissedIds]
  );

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, dismissNotification, clearAllNotifications }}
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
