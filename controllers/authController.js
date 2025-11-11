// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import Admin from "../models/admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "username & password required" });

    const exists = await Admin.findOne({ where: { username } });
    if (exists) return res.status(409).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hashed });
    return res.status(201).json({ message: "Admin created", admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "username & password required" });

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: admin.role },process.env.JWT_SECRET,      { expiresIn: "1d" }
    );
    return res.status(200).json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
