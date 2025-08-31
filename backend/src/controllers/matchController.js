// import { findMatchesForTrip } from "../services/matchService.js";
// export async function getMatches(req, res) {
//   const { tripId } = req.params;
//   const results = await findMatchesForTrip(tripId, req.userId);
//   res.json(results);
// }

import { findMatchesForTrip, findMatchesForUser } from "../services/matchService.js";


export async function getMatches(req, res) {
  try {
    const { tripId } = req.params;
    const matches = await findMatchesForTrip(tripId, req.userId);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function getAllMatches(req, res) {
  try {
    const matches = await findMatchesForUser(req.userId);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


