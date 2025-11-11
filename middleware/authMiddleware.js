import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Middleware to verify token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // includes id, role, etc.
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// ✅ Middleware to restrict route access by role
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data found." });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied. Insufficient privileges." });
    }

    next();
  };
};

// ✅ (Optional) Middleware to allow multiple roles for flexibility
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data found." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }

    next();
  };
};
