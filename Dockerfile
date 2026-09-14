# CraftGali — the web app.
#
# Built from the repository root because the migrations the app needs live in
# apps/backend/migrations, outside apps/web. Point Coolify's build context at
# the repo root and its Dockerfile at this file.

# ---------------------------------------------------------------- deps ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci

# --------------------------------------------------------------- build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web ./

# The build reaches no database: lib/db.ts opens its pool on first query
# rather than at import, so no DATABASE_URL is needed here. Do not add one —
# a build-time secret ends up in the image.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ------------------------------------------------------------- runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Never run the server as root.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: "standalone"` traces the modules actually reached and writes a
# server.js beside them; static assets and public/ are not traced and have to
# be copied alongside.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# The schema, and the runner that applies it. Standalone does not trace these
# because nothing imports them — the entrypoint runs them. `pg` itself is
# already traced (lib/db.ts imports it), so the migration script borrows the
# server's copy rather than carrying a hand-maintained dependency list.
COPY --chown=nextjs:nodejs apps/backend/migrations ./migrations
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.mjs ./scripts/migrate.mjs

COPY --chown=nextjs:nodejs infra/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
