import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env", debug: false });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
	schema: "./lib/schema.ts",
	out: "./supabase/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
