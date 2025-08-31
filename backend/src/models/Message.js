// models/Message.js
import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// // Compound index for efficient queries
// messageSchema.index({ sender: 1, recipient: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
