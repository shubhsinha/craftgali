/*
 * Applies apps/backend/migrations/*.sql in order, recording each in
 * schema_migrations so a re-run is a no-op.
 *
 * Runs in two places and has to work in both:
 *   - locally,   `npm run migrate`, reading .env.local
 *   - in the container, from the entrypoint, reading the real environment
 *
 * The migrations belong to the Go service, which owns the schema; this runner
 * lives here only because the web app is currently the one that can execute it.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));

/* A .env.local is a developer convenience. Real environment wins over it, so a
   stale local file can never quietly point production at the wrong database. */
function loadLocalEnv() {
  const file = resolve(here, "..", ".env.local");
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key]) continue;
    process.env[key] = line.slice(eq + 1).trim().replace(/^"|"$/g, "");
  }
}

loadLocalEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("migrate: DATABASE_URL is not set.");
  process.exit(1);
}

/* Beside the script in the image, up in apps/backend in the repo. */
const dir = [join(here, "..", "..", "..", "apps", "backend", "migrations"), join(here, "..", "migrations")]
  .find((candidate) => existsSync(candidate));

if (!dir) {
  console.error("migrate: no migrations directory found.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString, max: 2 });

/*
 * One deploy at a time.
 *
 * Every container runs this on start, so two replicas coming up together would
 * otherwise race to apply the same file. A session-level advisory lock costs
 * nothing and makes the second one wait and then find nothing to do.
 */
const LOCK = 8_140_991;

try {
  await pool.query("select pg_advisory_lock($1)", [LOCK]);

  await pool.query(`create table if not exists schema_migrations (
    name text primary key, applied_at timestamptz not null default now())`);

  const done = new Set(
    (await pool.query("select name from schema_migrations")).rows.map((row) => row.name),
  );

  let applied = 0;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(file)) {
      console.log("skip  ", file);
      continue;
    }

    const sql = readFileSync(join(dir, file), "utf8");
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log("apply ", file);
      applied++;
    } catch (error) {
      await client.query("rollback");
      console.error("FAIL  ", file, "->", error.message);
      /* A half-migrated schema is worse than a stopped deploy. */
      process.exitCode = 1;
      break;
    } finally {
      client.release();
    }
  }

  if (!process.exitCode) console.log(`migrate: up to date (${applied} applied)`);
} finally {
  await pool.query("select pg_advisory_unlock($1)", [LOCK]).catch(() => {});
  await pool.end();
}
