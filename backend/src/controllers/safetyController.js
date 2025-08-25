import Report from "../models/Report.js";
import User from "../models/User.js";

export async function blockUser(req, res) {
  const { userIdToBlock } = req.body;
  await User.updateOne(
    { _id: req.userId },
    { $addToSet: { "safetyFlags.blockedUserIds": userIdToBlock } }
  );
  res.json({ ok: true });
}

export async function report(req, res) {
  const { targetUser, targetTrip, reason, details } = req.body;
  const r = await Report.create({ reporter: req.userId, targetUser, targetTrip, reason, details });
  res.json(r);
}
