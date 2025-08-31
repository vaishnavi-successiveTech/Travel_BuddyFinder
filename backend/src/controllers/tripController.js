import { tripValidationSchema } from "../middleware/validation.js";
import Trip from "../models/Trip.js";

// export const createTrip = async (req, res) => {
//   try {
//     const {
//       destination,
//       startDate,
//       endDate,
//       activities,
//       openToJoin,
//       budget,
//       travelStyle,
//       maxGroupSize,
//       imageUrl // <-- ✅ include imageUrl from frontend
//     } = req.body;

//     // creator should come from logged-in user (req.userId set by auth middleware)
//     const trip = new Trip({
//       creator: req.userId,
//       destination,
//       startDate,
//       endDate,
//       activities,
//       openToJoin,
//       budget,
//       travelStyle,
//       maxGroupSize,
//       imageUrl // <-- ✅ store in DB
//     });

//     await trip.save();
//     res.status(201).json(trip);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: "Failed to create trip" });
//   }
// };

export async function createTrip(req, res) {
  try {
    // Add creator to request body before validation
    const tripData = { ...req.body, creator: req.userId };

    const { error, value } = tripValidationSchema.validate(tripData, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details });

    const t = await Trip.create(value);
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// export async function createTrip(req, res) {
   
//   const t = await Trip.create({ ...req.body, creator: req.userId });
//   res.json(t);
// }

export async function alltrips(req, res) {
  try {
    const trips = await Trip.find().populate("creator", "name email"); 
    // 👆 populate will return user info of creator if you want
    
    return res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return res.status(500).json({ error: "Failed to fetch trips" });
  }
}
export async function myTrips(req, res) {

  console.log('User ID from token:', req.userId);  // Log the user ID
  const list = await Trip.find({ creator: req.userId }).sort({ startDate: 1 });
  console.log('Trips found:', list);  // Log the fetched trips

  if (list.length === 0) {
    return res.status(404).json({ error: "No trips found" });
  }

  res.json(list);
}
// getCurrentTrip 

export async function getMyCurrentTrip(req, res) {
  try {
    const today = new Date();
    // Get one upcoming or ongoing trip
    const trip = await Trip.findOne({
      creator: req.userId,
      endDate: { $gte: today },
    }).sort({ startDate: 1 });

    res.json(trip || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// for open particular trip details
export async function getTripById(req, res) {

  const { id } = req.params;  // Get trip id from request params
  console.log("id of trip",id)

  try {
    // Find the trip by ID and include the creator details using populate
    const trip = await Trip.findOne({ _id: id, creator: req.userId }).populate('creator', 'name email'); // populate creator to get their details

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(trip);  // Send the trip details in the response
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
export async function updateTrip(req, res) {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateTripValidationSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details });

    // Find and update only validated fields
    const t = await Trip.findOneAndUpdate(
      { _id: id, creator: req.userId },
      value,
      { new: true }
    );

    if (!t) return res.status(404).json({ error: "Trip not found or you are not the creator" });

    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// export async function updateTrip(req, res) {
//   const { id } = req.params;
//   const t = await Trip.findOneAndUpdate({ _id: id, creator: req.userId }, req.body, { new: true });
//   if (!t) return res.status(404).json({ error: "Not found" });
//   res.json(t);
// }
export async function deleteTrip(req, res) {
  const { id } = req.params;
  const ok = await Trip.findOneAndDelete({ _id: id, creator: req.userId });
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
}


export async function searchTrips(req, res) {
  const {
    destination,
    gender,
    budget,
    activity,
    travelStyle,
    start,
    end,
    ageMin,
    ageMax,
    page = 1,
    limit = 5,
  } = req.query;

  const q = { openToJoin: true };

  // ✅ partial match instead of exact
  if (destination) q.destination = new RegExp(destination, "i");

  if (budget) q.budget = budget;
  if (activity) q.activities = { $in: activity.split(",") };
   if (travelStyle) {
    q.travelStyle = { $in: travelStyle.split(",") };
  };

  if (start || end) {
    const startDate = start ? new Date(start) : new Date("1900-01-01");
    const endDate = end ? new Date(end) : new Date("2999-12-31");
    q.$and = [
      { startDate: { $lte: endDate } },
      { endDate: { $gte: startDate } },
    ];
  }

  const pipeline = [
    { $match: q },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    { $unwind: "$creator" },
  ];

  if (gender) {
    pipeline.push({
      $match: { "creator.gender": { $in: gender.split(",") } },
    });
  }

  if (ageMin || ageMax) {
    const min = parseInt(ageMin) || 0;
    const max = parseInt(ageMax) || 120;
    pipeline.push({
      $match: { "creator.age": { $gte: min, $lte: max } },
    });
  }

  pipeline.push({ $project: { "creator.passwordHash": 0 } });

  const skip = (page - 1) * limit;

  // ✅ get paginated results
  const results = await Trip.aggregate([
    ...pipeline,
    { $sort: { startDate: 1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
  ]);

  // ✅ get total count without pagination
  const totalDocs = await Trip.aggregate([
    ...pipeline,
    { $count: "total" },
  ]);

  const total = totalDocs.length ? totalDocs[0].total : 0;

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / limit),
    results,
  });
}
