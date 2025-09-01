import { Router } from "express";
import { register, login, me, logout, completeProfile, forgotPassword, resetPassword, updateProfile, updatePrivacy } from "../controllers/authController.js";
import { authRequired } from "../middleware/auth.js";
import { upload } from "../middleware/multerImage.js";
import User from "../models/User.js";
const r = Router();
r.post("/register", register);

r.post("/login", login);

r.get("/me", authRequired, me);
r.post("/complete", authRequired, completeProfile);
r.post("/logout", logout);


// API to update profile image
r.post("/upload-avatar", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findById(req.userId); // req.userId comes from authRequired
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save relative path
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ 
      message: "Profile image updated successfully", 
      imageUrl: user.avatar 
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
r.patch("/updateProfile", authRequired, updateProfile);
r.patch("/updatePrivacy", authRequired, updatePrivacy);

r.post("/forgot-password", forgotPassword);

r.post("/reset-password", resetPassword);
export default r;
