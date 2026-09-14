# Deploying CraftGali

Coolify, one application, built from the repository root.

## Coolify settings

| Field | Value |
|---|---|
| Build pack | Dockerfile |
| Base directory | `/` (the repository root, **not** `apps/web`) |
| Dockerfile location | `/Dockerfile` |
| Port | `3000` |

The build context has to be the repo root because the schema lives in
`apps/backend/migrations`, outside `apps/web`.

## Environment

Set these in Coolify, not in a file. `.env.local` is gitignored and excluded
from the image, so nothing is inherited from a developer's machine.

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Neon pooler endpoint is fine. Keep `sslmode=require`. |
| `AUTH_SECRET` | yes | **Generate a fresh one.** Reusing the dev value makes a dev session cookie valid in production. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SITE_ORIGIN` | yes | `https://your-domain`. Password-reset links are built from it; unset, they point at localhost. |
| `RESEND_API_KEY` | for reset | Without it, reset links are written to the container log instead of sent. |
| `MAIL_FROM` | for reset | e.g. `CraftGali <no-reply@your-domain>` |
| `SERVER_ACTION_ORIGINS` | only if needed | See below. |

None of these are needed at build time, and none should be build arguments —
a build-time secret is baked into the image.

## Migrations

The entrypoint runs them before starting the server, so it is impossible to
ship code that expects a column the database does not have. They are
idempotent and take a Postgres advisory lock, so several replicas starting
together is safe: the first applies, the rest find nothing to do.

Nothing to configure. To watch it, read the container log on first boot —
it prints `skip`/`apply` per file, then `migrate: up to date`.

## If sign-in fails with "Invalid Server Actions request"

Next refuses a server action whose `origin` header does not match the host it
was forwarded under. That is the CSRF defence, and it is the one thing a
reverse proxy in front of this app can get wrong. Traefik normally forwards
`x-forwarded-host` correctly — but if it does not, **every** form on the site
fails, because the whole app is server actions.

The fix is one variable:

    SERVER_ACTION_ORIGINS=your-domain.com,www.your-domain.com

Host names only, no scheme. Check the container log first: Next prints exactly
which two values it compared.

## Known limits

**Photographs are stored in Postgres**, as `bytea` in `listing_photos`, and
served from `/api/photos/[id]`. That was the right trade while there was no
object storage to configure, and it survives a deploy where a written file
would not — but at up to 6 x 4 MB per listing, **Neon's 0.5 GB free tier holds
roughly twenty listings**. Moving this to object storage (R2 is cheapest) is
the first thing to do once real sellers are uploading.

**Mail has no provider until `RESEND_API_KEY` is set.** Everything else works;
password reset is the only flow that silently degrades, and it degrades to a
log line rather than an error.

**Google sign-in, offers, messaging and billing do not exist yet.** The buttons
that would start them say so.
