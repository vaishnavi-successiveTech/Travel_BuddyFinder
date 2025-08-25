import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
  const { name, email, password,gender } = req.body;
  if (!name || !email || !password || !gender) return res.status(400).json({ error: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash ,gender});
  res.json({ ok: true, userId: user._id });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 7*24*60*60*1000 });
  res.json({ ok: true,token:token });
}

// POST /profile/complete
export const completeProfile = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware
    const { age, interests, languages, travelStyle, preferences } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        age,
        interests,
        languages,
        travelStyle,
        preferences,
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
// export async function logout(_req, res) {
//   res.clearCookie("token"); res.json({ ok: true });
// }
