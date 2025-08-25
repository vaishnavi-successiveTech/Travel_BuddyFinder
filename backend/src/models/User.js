import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  idVerified: { type: Boolean, default: false }, // KYC later
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  age: { type: Number, min: 18, max: 100 },
  gender: { type: String, enum: ["male","female","other"], default: "other" },
  interests: [{ type: String, index: true }], // "trekking","food","history"
  languages: [{ type: String }],
  travelStyle: [{ type: String }], // "budget","adventure","luxury","history"
  preferences: {
    budget: { type: String, enum: ["low","mid","high"], default: "mid" },
    preferredGenders: [{ type: String }],
    activityTypes: [{ type: String }], // "trek","food","sightseeing"
  },
  profileCompleted: { type: Boolean, default: false }
,
  visibility: {
    showLimitedUntilTrusted: { type: Boolean, default: true },
  },
  verification: { type: verificationSchema, default: () => ({}) },
  safetyFlags: {
    blockedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  subscription: {
    planId: { type: String, default: null },
    status: { type: String, enum: ["inactive","active","past_due"], default: "inactive" },
    currentPeriodEnd: { type: Date, default: null },
  }
}, { timestamps: true });

userSchema.index({ interests: 1 });
export default mongoose.model("User", userSchema);
