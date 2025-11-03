// scripts/createAdmin.js
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import Admin from "../models/admin.js";

const createAdmin = async (username, password) => {
  try {
    await sequelize.sync();
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hashedPassword });
    console.log(`✅ Admin "${username}" created successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
    process.exit(1);
  }
};

// Replace these values:
createAdmin("gandi", "123456");
