import { Pool } from "pg";

/**
 * One pool per process. Next's dev server reloads modules on every edit, so the
 * pool is parked on globalThis — otherwise each save leaks a set of connections
 * and Neon starts refusing them.
 */
const globalForDb = globalThis as unknown as { cgPool?: Pool };

function makePool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env.local.");
  }

  /* sslmode in the URL drives TLS, with real certificate verification — Neon
     serves a publicly-trusted cert, so there is nothing to disable. */
  return new Pool({ connectionString, max: 5, idleTimeoutMillis: 30_000 });
}

/**
 * The pool is built on first use, never at import.
 *
 * `next build` loads every module to collect page data, including this one. A
 * pool constructed at import time would throw there for want of DATABASE_URL —
 * which is exactly the situation inside a Docker build, where the database is
 * not reachable and should not need to be. Deferring it means the build only
 * fails if a page actually runs a query, which is a real error worth having.
 */
function getPool() {
  if (globalForDb.cgPool) return globalForDb.cgPool;

  const pool = makePool();
  if (process.env.NODE_ENV !== "production") globalForDb.cgPool = pool;
  return (globalForDb.cgPool = pool);
}

export async function query<T extends object>(
  text: string,
  params: unknown[] = [],
) {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends object>(
  text: string,
  params: unknown[] = [],
) {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Runs several statements as one unit, on one connection.
 *
 * `query` above takes an arbitrary connection from the pool each time, so two
 * calls are not in the same transaction however close together they are. Any
 * write that must not half-succeed — opening a storefront writes the shop row
 * and flips the owner's role, and a user with one but not the other is broken —
 * goes through here.
 */
export async function transaction<T>(
  work: (run: <R extends object>(text: string, params?: unknown[]) => Promise<R[]>) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query("begin");
    const result = await work(async <R extends object>(text: string, params: unknown[] = []) => {
      const rows = await client.query<R>(text, params);
      return rows.rows;
    });
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * A connection string that supports LISTEN/NOTIFY.
 *
 * The pooler endpoint is PgBouncer in transaction mode, which silently drops
 * NOTIFY — a LISTEN on it succeeds and then never hears anything. The chat
 * broker needs a session it holds open, so it goes to the direct endpoint.
 * Neon names it the same host without `-pooler`; anything else sets
 * DATABASE_URL_DIRECT explicitly.
 */
export function directConnectionString() {
  const explicit = process.env.DATABASE_URL_DIRECT;
  if (explicit) return explicit;
  const pooled = process.env.DATABASE_URL;
  if (!pooled) throw new Error("DATABASE_URL is not set.");
  return pooled.replace("-pooler.", ".");
}
