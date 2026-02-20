import { Pool } from "pg";

const globalForPg = globalThis;
const configuredPoolMax = Number.parseInt(process.env.PG_POOL_MAX || process.env.DB_POOL_MAX || "3", 10);
const poolMax = Number.isFinite(configuredPoolMax) && configuredPoolMax > 0 ? configuredPoolMax : 3;

export const pool =
  globalForPg.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: poolMax,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  });

if (process.env.NODE_ENV !== "production") globalForPg.__pgPool = pool;
