import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function calculateMatchScore(user1, user2) {
  let score = 0;
  
  // Interest matching
  const commonInterests = user1.interests?.filter(interest => 
    user2.interests?.includes(interest)
  ) || [];
  score += commonInterests.length * 10;
  
  // Travel style matching
  if (user1.travelStyle === user2.travelStyle) score += 20;
  
  // Budget compatibility
  const budgetDiff = Math.abs((user1.budget || 0) - (user2.budget || 0));
  if (budgetDiff < 500) score += 15;
  else if (budgetDiff < 1000) score += 10;
  
  // Age compatibility
  const ageDiff = Math.abs((user1.age || 25) - (user2.age || 25));
  if (ageDiff < 5) score += 15;
  else if (ageDiff < 10) score += 10;
  
  return Math.min(score, 100);
}