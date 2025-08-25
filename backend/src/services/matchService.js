import Trip from "../models/Trip.js";
import User from "../models/User.js";
import mongoose from "mongoose";

function datesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

export async function findMatchesForTrip(tripId, userId) {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");

  const me = await User.findById(userId).lean();
  const blocked = new Set([...(me?.safetyFlags?.blockedUserIds || [])].map(x => x.toString()));

  const candidates = await Trip.aggregate([
    { $match: {
        _id: { $ne: trip._id },
        destination: new RegExp(`^${trip.destination}$`, "i"),
        openToJoin: true
      }
    },
    { $lookup: { from: "users", localField: "creator", foreignField: "_id", as: "creator" } },
    { $unwind: "$creator" },
    { $match: { "creator._id": { $ne: new mongoose.Types.ObjectId(userId) } } },
    { $project: { "creator.passwordHash": 0 } }
  ]);

  const scored = candidates
    .filter(c => datesOverlap(trip.startDate, trip.endDate, c.startDate, c.endDate))
    .filter(c => !blocked.has(c.creator._id.toString()))
    .map(c => {
      const sharedInterests = intersect(me.interests || [], c.creator.interests || []).length;
      const sharedStyle = intersect(trip.travelStyle || [], c.travelStyle || []).length;
      const budgetMatch = (trip.budget === c.budget) ? 1 : 0;
      const score = sharedInterests * 2 + sharedStyle + budgetMatch;
      return { ...c, score };
    })
    .sort((a,b) => b.score - a.score);

  return scored.slice(0, 50);
}

function intersect(a,b){ const setB=new Set(b); return a.filter(x=>setB.has(x)); }
