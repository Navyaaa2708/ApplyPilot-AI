import pg, { QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool: PgPool } = pg;

export const db = new PgPool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.APP_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export async function query(text: string, params: unknown[] = []): Promise<QueryResult> {
  const client = await db.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
