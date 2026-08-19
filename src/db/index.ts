import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../config/env.config.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const checkDatabaseConnection = async () => {
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    console.error("Failed to connect to database:", err)
    process.exit(1);
  }
}

export const db = drizzle(pool);

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
