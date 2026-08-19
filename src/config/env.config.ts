import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
  // Server Config
  FRONTEND_URL: z.url(),
  SERVER_PORT: z.coerce.number().int().positive(),
  SERVER_URL: z.url(),
  DATABASE_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    JSON.stringify(z.treeifyError(parsed.error), null, 2),
  );
  throw new Error("Invalid environment variables");
}

const env = parsed.data;
export default env;
