import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ===============================
// AUTH MIDDLEWARE
// ===============================
export function authMiddleware(req, res, next) {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ===============================
// GENERIC ROLE CHECKER
// ===============================
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user data inside request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
// ===============================
// SPECIFIC ROLE CHECKERS
// ===============================

// Only WARDEN can access
export function authorizeWarden(req, res, next) {
  if (!req.user || req.user.role !== "warden") {
    return res.status(403).json({ message: "Only Warden Access Allowed" });
  }
  next();
}

// Only CHIEF WARDEN can access
export function authorizeChiefWarden(req, res, next) {
  if (!req.user || req.user.role !== "chief_warden") {
    return res.status(403).json({ message: "Only Chief Warden Access Allowed" });
  }
  next();
}
