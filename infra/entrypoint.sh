#!/bin/sh
# Bring the schema up to date, then hand off to the server.
#
# Migrations run on every start rather than as a separate deploy step, so there
# is no way to ship code that expects a column the database does not have. They
# are idempotent and take an advisory lock, so several replicas starting at once
# is fine — the first applies, the rest find nothing to do.
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "entrypoint: applying migrations"
  node ./scripts/migrate.mjs
else
  echo "entrypoint: DATABASE_URL is not set — skipping migrations" >&2
fi

echo "entrypoint: starting CraftGali on ${HOSTNAME:-0.0.0.0}:${PORT:-3000}"
exec node server.js
