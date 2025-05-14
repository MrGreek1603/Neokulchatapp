import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
// const databaseUrl =
//   "postgresql://postgres:chatapp123*@db.bzucvwewwriqyatbvjbp.supabase.co:5432/postgres";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const db = drizzle(pool);
