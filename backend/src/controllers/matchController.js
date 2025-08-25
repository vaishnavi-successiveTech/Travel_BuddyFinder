import { findMatchesForTrip } from "../services/matchService.js";
export async function getMatches(req, res) {
  const { tripId } = req.params;
  const results = await findMatchesForTrip(tripId, req.userId);
  res.json(results);
}
