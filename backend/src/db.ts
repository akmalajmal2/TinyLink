import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

export const pool = new Pool({ connectionString, idleTimeoutMillis: 30000 });

pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
});

export async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res as { rows: T[]; rowCount: number };
}
