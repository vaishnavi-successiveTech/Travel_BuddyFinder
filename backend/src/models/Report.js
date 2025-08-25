import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetTrip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  reason: { type: String, required: true }, // "spam","abuse","fake profile"
  details: { type: String },
  status: { type: String, enum: ["open","reviewing","resolved"], default: "open" }
}, { timestamps: true });
export default mongoose.model("Report", reportSchema);
