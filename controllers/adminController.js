// controllers/adminController.js
import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";

// 🟢 CREATE ADMIN (Root only)
export const createAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin username already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role is 'admin' unless explicitly set to 'root_admin'
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      role: role || "admin",
    });

    res.status(201).json({
      message: "✅ New admin created successfully.",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    res.status(500).json({ message: "Server error. Could not create admin." });
  }
};

// 🔵 GET ALL ADMINS (Root only)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ["id", "username", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ admins });
  } catch (err) {
    console.error("❌ Error fetching admins:", err);
    res.status(500).json({ message: "Failed to fetch admins." });
  }
};

// 🔴 DELETE ADMIN (Root only)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself (optional safeguard)
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    await admin.destroy();
    res.status(200).json({ message: "✅ Admin deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting admin:", err);
    res.status(500).json({ message: "Server error. Could not delete admin." });
  }
};
