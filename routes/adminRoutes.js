// routes/adminRoutes.js
import express from "express";
import {
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/adminController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protected admin dashboard route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to admin area", user: req.user });
});

// 👑 Create a new admin — only root admin can do this
router.post("/create", verifyToken, requireRole("root_admin"), createAdmin);

// 👑 View all admins — only root admin
router.get("/list", verifyToken, requireRole("root_admin"), getAllAdmins);

// 👑 Delete an admin by ID — only root admin
router.delete("/delete/:id", verifyToken, requireRole("root_admin"), deleteAdmin);

export default router;
