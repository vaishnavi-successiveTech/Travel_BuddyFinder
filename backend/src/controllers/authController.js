import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";  
import { completeProfileSchema, loginSchema, signupSchema } from "../middleware/validation.js";
import { NEW_USER, pubsub } from "../graphql/server/pubsub.js";

 
  // Import Joi validation

// Signup
export async function register(req, res) {
  // Validate request body using Joi
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, gender } = req.body;

  // Check if user already exists
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ name, email, passwordHash, gender });

  // Publish the new user event
  pubsub.publish(NEW_USER, { newUser: user });

  // Respond
  res.json({ ok: true, userId: user._id });
}

// Login
export async function login(req, res) {
  const { error } = loginSchema.validate(req.body); // Validate login request
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { uid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "/default-avatar.png",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// Complete Profile
export const completeProfile = async (req, res) => {
  const { error } = completeProfileSchema.validate(req.body); // Validate profile data
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = req.userId; // from JWT middleware
    const { age, interests, languages, travelStyle, preferences,avatar} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        age,
        interests,
        languages,
        travelStyle,
        preferences,
        avatar,
        
        profileCompleted: true, 
      },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile completed", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Other routes like `me`, `logout`, `forgotPassword` etc. remain unchanged

export async function me(req, res) {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
}

export async function logout(req, res) {
  try {
    const token = req.cookies?.token;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("User logged out:", payload.uid); // here you know which user
      // optionally: save logout event in DB
    }

    res.clearCookie("token");
    res.json({ ok: true, message: "Logged out successfully" });
  } catch (err) {
    res.clearCookie("token");
    res.json({ ok: true, message: "Token invalid but cleared" });
  }
}
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create a reset token valid for 15 minutes
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:3000/forget/reset/${resetToken}`;

    // Send the reset email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password. The link expires in 15 minutes.</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.json({ message: "Reset link sent to email",resetToken });
  } catch (err) {
    res.status(500).json({ error: "Error sending reset email", details: err.message });
  }
}

// ================= Reset Password =================
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Error resetting password", details: err.message });
  }
}

// ================= Protected Profile =================
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};