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

export async function unblockUser(req, res) {
  const { userIdToUnblock } = req.body;
  try {
    await User.updateOne(
      { _id: req.userId },
      { $pull: { "safetyFlags.blockedUserIds": userIdToUnblock } }
    );
    res.json({ ok: true, message: "User unblocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to unblock user" });
  }
}


// Get reports made by the logged-in user
export async function getMyReports(req, res) {
  try {
    const reports = await Report.find({ reporter: req.userId })
      .populate("targetUser", "name email") // populate user details
      .populate("targetTrip", "destination startDate endDate") // populate trip details
      .sort({ createdAt: -1 }); // latest first
    res.json({ ok: true, reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch reports" });
  }
}


// controllers/safety.js
export async function getBlockedUsers(req, res) {
  try {
    const user = await User.findById(req.userId, "safetyFlags.blockedUserIds").populate("safetyFlags.blockedUserIds", "name email");
    res.json({ blockedUsers: user.safetyFlags.blockedUserIds || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blocked users" });
  }
}
