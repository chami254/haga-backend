// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import sequelize, { testConnection } from "./config/db.js";
import Admin from "./models/admin.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js"; // ✅ import middleware

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Protected test route to confirm token verification
app.get("/api/admin/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to admin area",
    user: req.user, // comes from decoded JWT
  });
});

// === Error handling middleware ===
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// === Start server ===
async function start() {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); // creates/updates tables automatically
    console.log("✅ Database synced successfully");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
