import Trip from "../models/Trip.js";
import mongoose from "mongoose";

function datesOverlap(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) <= new Date(bEnd) && new Date(bStart) <= new Date(aEnd);
}

export async function findMatchesForTrip(tripId, userId) {
  // Fetch your trip
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");

  // Find candidate trips: other users, same destination, openToJoin
  const candidates = await Trip.find({
    _id: { $ne: trip._id }, // exclude your own trip
    destination: { $regex: `^${trip.destination}$`, $options: "i" },
    openToJoin: true,
  }).populate("creator", "-passwordHash");

  // Filter only trips with overlapping dates
  const matches = candidates.filter(c =>
    datesOverlap(trip.startDate, trip.endDate, c.startDate, c.endDate)
  );

  return matches;
}



// 🔹 New function: check all my trips
export async function findMatchesForUser(userId) {
  // 1️⃣ Get all my trips
  const myTrips = await Trip.find({ creator: userId });
  if (!myTrips.length) return [];

  // 2️⃣ Get all other users’ trips that are open
  const candidates = await Trip.find({
    creator: { $ne: userId },
    openToJoin: true,
  }).populate("creator", "name email avatar gender");

  // 3️⃣ Compare each of my trips with each candidate trip
  const matches = [];

  for (const myTrip of myTrips) {
    for (const cand of candidates) {
      if (
        myTrip.destination.toLowerCase() === cand.destination.toLowerCase() &&
        datesOverlap(myTrip.startDate, myTrip.endDate, cand.startDate, cand.endDate)
      ) {
        matches.push({
          myTrip: myTrip.toObject(),      // your trip
          buddyTrip: cand.toObject(),     // buddy’s trip with populated creator
        });
      }
    }
  }

  return matches;
}


// import Trip from "../models/Trip.js";
// import User from "../models/User.js";
// import mongoose from "mongoose";

// function datesOverlap(aStart, aEnd, bStart, bEnd) {
//   return aStart <= bEnd && bStart <= aEnd;
// }

// export async function findMatchesForTrip(tripId, userId) {
//   const trip = await Trip.findById(tripId);
//   if (!trip) throw new Error("Trip not found");

//   const me = await User.findById(userId).lean();
//   const blocked = new Set([...(me?.safetyFlags?.blockedUserIds || [])].map(x => x.toString()));

//   const candidates = await Trip.aggregate([
//     { $match: {
//         _id: { $ne: trip._id },
//         destination: new RegExp(`^${trip.destination}$`, "i"),
//         openToJoin: true
//       }
//     },
//     { $lookup: { from: "users", localField: "creator", foreignField: "_id", as: "creator" } },
//     { $unwind: "$creator" },
//     { $match: { "creator._id": { $ne: new mongoose.Types.ObjectId(userId) } } },
//     { $project: { "creator.passwordHash": 0 } }
//   ]);

//   const scored = candidates
//     .filter(c => datesOverlap(trip.startDate, trip.endDate, c.startDate, c.endDate))
//     .filter(c => !blocked.has(c.creator._id.toString()))
//     .map(c => {
//       const sharedInterests = intersect(me.interests || [], c.creator.interests || []).length;
//       const sharedStyle = intersect(trip.travelStyle || [], c.travelStyle || []).length;
//       const budgetMatch = (trip.budget === c.budget) ? 1 : 0;
//       const score = sharedInterests * 2 + sharedStyle + budgetMatch;
//       return { ...c, score };
//     })
//     .sort((a,b) => b.score - a.score);

//   return scored.slice(0, 50);
// }

// function intersect(a,b){ const setB=new Set(b); return a.filter(x=>setB.has(x)); }
