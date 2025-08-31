// middleware/auth.js
import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  // Try cookie first, then Authorization header
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.uid;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

