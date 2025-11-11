// config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Get environment variables
const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

// Create Sequelize instance for PostgreSQL
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "postgres", // ✅ use postgres (Render default)
  port: DB_PORT || 5432,
  logging: false, // disable SQL logs in console
});

// Test database connection
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
}

export default sequelize;
