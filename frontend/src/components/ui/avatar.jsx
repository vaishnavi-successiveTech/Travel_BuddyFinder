// components/ui/avatar.jsx
'use client';

import React from 'react';

export function Avatar({ src = "/image/girl.png", alt = "User", size = 'h-8 w-8', className = '' }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 ${size} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
        />
      ) : (
        <AvatarFallback>{alt?.charAt(0) || '?'}</AvatarFallback>
      )}
    </div>
  );
}

export function AvatarFallback({ children }) {
  return (
    <span className="text-gray-700 font-medium select-none">
      {children}
    </span>
  );
}

// Usage
// <Avatar alt="Vaishnavi" size="h-10 w-10" />
