export const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 28,
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    interests: ['Photography', 'Hiking', 'Local Cuisine', 'Museums'],
    travelStyle: 'Adventure',
    budget: 2500,
    verified: true,
    premium: true,
    bio: 'Love exploring hidden gems and capturing moments through my lens. Always up for an adventure!',
    languages: ['English', 'Mandarin'],
    trips: ['2', '4']
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    age: 32,
    location: 'New York, NY',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    interests: ['History', 'Architecture', 'Wine Tasting', 'Museums'],
    travelStyle: 'Cultural',
    budget: 3000,
    verified: true,
    premium: false,
    bio: 'History enthusiast who loves exploring ancient sites and learning about different cultures.',
    languages: ['English', 'Spanish'],
    trips: ['1', '3']
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 26,
    location: 'Austin, TX',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    interests: ['Beach', 'Nightlife', 'Shopping', 'Local Cuisine'],
    travelStyle: 'Relaxed',
    budget: 1800,
    verified: false,
    premium: true,
    bio: 'Beach lover and foodie looking for relaxing getaways with great company.',
    languages: ['English', 'Spanish'],
    trips: ['5']
  }
];

export const mockTrips = [
  {
    id: '1',
    title: 'Ancient Wonders of Greece',
    destination: 'Athens, Greece',
    startDate: '2025-03-15',
    endDate: '2025-03-22',
    budget: 2800,
    spots: 2,
    spotsAvailable: 1,
    createdBy: '2',
    image: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    description: 'Explore the birthplace of democracy and philosophy. Visit the Acropolis, Parthenon, and ancient Agora.',
    activities: ['Historical Tours', 'Museums', 'Local Cuisine', 'Island Hopping'],
    accommodation: 'Mid-range Hotels',
    travelStyle: 'Cultural',
    groupSize: 'Small (2-4 people)',
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'Patagonia Adventure Trek',
    destination: 'Torres del Paine, Chile',
    startDate: '2025-04-10',
    endDate: '2025-04-20',
    budget: 3500,
    spots: 4,
    spotsAvailable: 2,
    createdBy: '1',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    description: 'Epic hiking adventure through one of the most beautiful national parks in the world.',
    activities: ['Hiking', 'Photography', 'Wildlife Watching', 'Camping'],
    accommodation: 'Camping & Hostels',
    travelStyle: 'Adventure',
    groupSize: 'Small (2-4 people)',
    difficulty: 'Challenging'
  },
  {
    id: '3',
    title: 'Rome & Tuscany Cultural Journey',
    destination: 'Rome & Florence, Italy',
    startDate: '2025-05-05',
    endDate: '2025-05-15',
    budget: 2200,
    spots: 3,
    spotsAvailable: 1,
    createdBy: '2',
    image: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    description: 'Immerse yourself in Renaissance art, Roman history, and incredible Italian cuisine.',
    activities: ['Art Museums', 'Wine Tasting', 'Cooking Classes', 'Historical Tours'],
    accommodation: 'Boutique Hotels',
    travelStyle: 'Cultural',
    groupSize: 'Small (2-4 people)',
    difficulty: 'Easy'
  },
  {
    id: '4',
    title: 'Japan Cherry Blossom Tour',
    destination: 'Tokyo & Kyoto, Japan',
    startDate: '2025-04-01',
    endDate: '2025-04-10',
    budget: 4000,
    spots: 2,
    spotsAvailable: 1,
    createdBy: '1',
    image: 'https://images.pexels.com/photos/2070030/pexels-photo-2070030.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    description: 'Experience the magical cherry blossom season in Japan\'s most iconic cities.',
    activities: ['Temple Visits', 'Cherry Blossom Viewing', 'Traditional Dining', 'Photography'],
    accommodation: 'Traditional Ryokans',
    travelStyle: 'Cultural',
    groupSize: 'Small (2-4 people)',
    difficulty: 'Easy'
  },
  {
    id: '5',
    title: 'Bali Beach & Wellness Retreat',
    destination: 'Ubud & Seminyak, Bali',
    startDate: '2025-06-01',
    endDate: '2025-06-08',
    budget: 1500,
    spots: 6,
    spotsAvailable: 3,
    createdBy: '3',
    image: 'https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    description: 'Relax and rejuvenate in paradise with yoga, spa treatments, and beautiful beaches.',
    activities: ['Beach Time', 'Yoga Classes', 'Spa Treatments', 'Local Markets'],
    accommodation: 'Resort & Villa',
    travelStyle: 'Relaxed',
    groupSize: 'Medium (4-8 people)',
    difficulty: 'Easy'
  }
];

export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Explorer',
    price: 0,
    period: 'month',
    features: [
      'Create up to 2 trips',
      'Basic matching algorithm',
      'Standard support',
      'Basic profile features'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Adventurer',
    price: 19.99,
    period: 'month',
    features: [
      'Unlimited trips',
      'Advanced matching algorithm',
      'Priority support',
      'Verified badge',
      'Advanced filters',
      'Real-time notifications',
      'Premium profile features'
    ],
    popular: true
  },
  {
    id: 'pro',
    name: 'Explorer Pro',
    price: 39.99,
    period: 'month',
    features: [
      'Everything in Adventurer',
      'Group trip organization',
      'Custom itinerary planning',
      'Travel insurance discounts',
      'Exclusive travel deals',
      'Concierge support'
    ],
    popular: false
  }
];