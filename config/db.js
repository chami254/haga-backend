// config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;

export async function testConnection() {
  try {
    // connect to MySQL *without specifying DB first*
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
    });

    // create DB if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Database "${DB_NAME}" ready.`);
    await connection.end();
  } catch (error) {
    console.error("❌ Failed to ensure database:", error);
  }
}

// Initialize Sequelize (now the DB definitely exists)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT || "mysql",
  logging: false, // optional: turn off SQL logging in console
});

export default sequelize;
