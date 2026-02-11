import { Pool } from "pg";

const globalForPg = globalThis;

export const pool =
  globalForPg.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") globalForPg.__pgPool = pool;
