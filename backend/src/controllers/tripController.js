import Trip from "../models/Trip.js";

export async function createTrip(req, res) {
  const t = await Trip.create({ ...req.body, creator: req.userId });
  res.json(t);
}
export async function myTrips(req, res) {
  const list = await Trip.find({ creator: req.userId }).sort({ startDate: 1 });
  res.json(list);
}
export async function updateTrip(req, res) {
  const { id } = req.params;
  const t = await Trip.findOneAndUpdate({ _id: id, creator: req.userId }, req.body, { new: true });
  if (!t) return res.status(404).json({ error: "Not found" });
  res.json(t);
}
export async function deleteTrip(req, res) {
  const { id } = req.params;
  const ok = await Trip.findOneAndDelete({ _id: id, creator: req.userId });
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
}
export async function searchTrips(req, res) {
  // filters: destination, gender, budget, activityTypes, date range
  const { destination, gender, budget, activity, start, end } = req.query;
  const q = { openToJoin: true };
  if (destination) q.destination = new RegExp(`^${destination}$`, "i");
  if (budget) q.budget = budget;
  if (activity) q.activities = { $in: activity.split(",") };
 if (start || end) {
  const startDate = start ? new Date(start) : new Date("1900-01-01");
  const endDate = end ? new Date(end) : new Date("2999-12-31");

  q.$and = [
    { startDate: { $lte: endDate } }, // trip must start before search window ends
    { endDate: { $gte: startDate } }  // trip must end after search window starts
  ];
}
  // gender filter works via creator’s profile => join-like with aggregation:
  const pipeline = [
    { $match: q },
    { $lookup: { from: "users", localField: "creator", foreignField: "_id", as: "creator" } },
    { $unwind: "$creator" },
  ];
  if (gender) pipeline.push({ $match: { "creator.gender": { $in: gender.split(",") } } });
  pipeline.push({ $project: { "creator.passwordHash": 0 } });
  const results = await Trip.aggregate(pipeline);
  res.json(results);
}
