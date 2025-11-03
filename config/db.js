// config/db.js
import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
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
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

export default sequelize;
