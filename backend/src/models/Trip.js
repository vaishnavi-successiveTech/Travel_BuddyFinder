import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    destination: { type: String, required: true, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    activities: [{ type: String }], // "museum","food tour","trek"
    openToJoin: { type: Boolean, default: true },
    budget: { type: String, enum: ["low", "mid", "high"], default: "mid" },
    travelStyle: [{ type: String }],
    maxGroupSize: { type: Number, default: 4 },
    imageUrl: { type: String }, // <-- Added field
    description: {
      type: String,
      default: "No description provided.",
    },
  },
  { timestamps: true }
);

tripSchema.index({ destination: 1, startDate: 1 });

export default mongoose.model("Trip", tripSchema);
