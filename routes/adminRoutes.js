// routes/adminRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// Protected example route (you'll replace with real handlers later)
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to admin area", user: req.user });
});

export default router;
