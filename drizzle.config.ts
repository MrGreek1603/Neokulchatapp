import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  out: "./db",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.bzucvwewwriqyatbvjbp:chatapp123*@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
  },
});
