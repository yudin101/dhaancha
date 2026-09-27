import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../config/env.config.js";
import AppError from "../utils/appError.util.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const checkDatabaseConnection = async () => {
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    console.error(err);
    throw new AppError(
      "Service temporarily unavailable",
      "SERVICE_UNAVAILABLE",
      503,
    );
  }
};

export const db = drizzle(pool);

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
