# CraftGali — Architecture

What is running, what will break first as it grows, and what to change in
which order. Written against the deployed system on 2026-09-16, not against
a plan.

## What is running today

One Next.js 14 service (App Router, server actions, standalone build) in a
Docker container on Coolify, behind Traefik, behind Cloudflare. Postgres on
Neon (Singapore, pooler endpoint). No other service: the Go scaffold in
`apps/backend` registers no routes and is not deployed.

```
browser ── Cloudflare ── Traefik ── Next.js (1 container) ── Neon Postgres
                                        │
                                        └── photos, covers, avatars: bytea in Postgres
```

Every page is server-rendered on demand (`force-dynamic`, `no-store`).
Measured on the live site: **2–3 s time-to-first-byte** for public pages.
That number is the whole story below.

## On "lakhs of concurrent users"

One lakh concurrent is the scale of a national ticketing site on a big night.
Nothing in this document gets there by itself, and any document that claimed
to would be selling you something. What this does is remove the things that
make it *impossible* and put in the things that make it *measurable*, so that
each order of magnitude is an infra change rather than a rewrite.

The honest sequence is: fix the read path (done below), move blobs out of
Postgres, cache public pages at the edge, then add instances. In that order,
because each one is useless without the one before it.

## Bottlenecks, in the order they bite

### 1. Photos in Postgres — bites at ~hundreds of users

Every image on every card is a `SELECT bytes FROM listing_photos`, decoded in
Node, streamed from the app container. A feed page with 48 cards is 48 large
row reads plus the page itself. Under load this saturates the database
connection pool with *image* traffic before a single query about listings has
run, and it saturates the container's outbound bandwidth long before CPU.

This was the right trade to get listing working with nothing to configure,
and it is the first thing to change. **Move to Cloudflare R2** (S3-compatible,
no egress fee, same account as the CDN in front of the site). The route
`/api/photos/[id]` stays as the URL shape and becomes a 302 to R2, so nothing
in the pages changes.

### 2. Nothing is cached — bites at the same time

Every public page — feed, storefront, listing — is rendered fresh per request
with `cache-control: no-store`. Cloudflare caches the static chunks and
nothing else. The Coolify box is one region; Neon is in Singapore; users are
in India. Each request is two intercontinental round-trips before a byte is
sent.

Two layers, in order:

- **Next tag cache.** Storefront and listing pages can render with
  `revalidate: 60` and a tag per handle/listing; every write action already
  calls `revalidatePath`, so switching those to `revalidateTag` makes the
  cache correct, not just fast. The feed stays dynamic — it depends on the
  viewer's city cookie.
- **Cloudflare cache rules** for `/artist/*` and `/listing/*` with a short
  TTL, bypassing when `cg_session` is present. Signed-out traffic — which is
  most of it — then never reaches the container at all.

### 3. The feed loaded everything — fixed in this pass

The discover page used to fetch every live listing and filter in the browser.
It now asks Postgres for one page of 48, already narrowed to the buyer's
radius (resolved to a set of city slugs) and search term, on
`idx_listings_feed`. The seeded comp pieces still ride behind page one so the
demo stays populated; they are a fixed few dozen rows and cost nothing.

### 4. Auth ran three queries per page — fixed in this pass

`currentUser()` had eighteen call sites — header, layout, page — and each
was a fresh `SELECT`. It is now wrapped in React's `cache()`, so a request
hits the users table once however many components ask. This is the correct
scope: fresh per request, once per request.

### 5. Rate limiting writes a row per attempt — bites at thousands

`auth_attempts` is written on every sign-in, save, follow and upload. It is
swept lazily and now indexed on `occurred_at`, which is enough for a while.
At real scale this is a Redis `INCR` with a TTL, not a table. Upstash gives
that with an HTTP API and no connection pool to manage from a serverless-ish
container.

### 6. One container — bites last

Coolify can run several replicas of the same image behind Traefik. The app
is already stateless (sessions are a signed cookie, drafts are in the
browser, uploads go to the database), the migration entrypoint takes an
advisory lock so replicas can start together, and the pool is `max: 5` per
process so Neon's pooler absorbs the fan-out. Scaling out is a slider.

What is **not** ready for that: the rate limiter and any future in-memory
cache. Both must be in Redis before a second replica is honest.

## What to do, in order

| # | Change | Why now | Effort |
|---|---|---|---|
| 1 | Cloudflare R2 for photos, covers, avatars | Everything else is bounded by this | a day |
| 2 | `revalidateTag` + Cloudflare cache rules on public pages | Turns 2 s into 50 ms for signed-out traffic | half a day |
| 3 | Redis (Upstash) for rate limiting | Prerequisite for replicas | half a day |
| 4 | Move the Coolify box to Mumbai; consider Neon's Mumbai region | Two intercontinental hops per request today | an afternoon |
| 5 | Second replica | Only after 1–3 | a slider |
| 6 | Neon read replica for the feed | Only when the pooler shows contention | a day |

Do not build the Go backend for scale reasons. It would double the operational
surface for no throughput gain — the database is the bottleneck, not the
language rendering HTML. Build it when the Flutter app needs an API the web
app does not, and not before.

## Load-testing before believing any of this

Before and after each step, run k6 or autocannon against `/discover`,
`/artist/anaya` and `/listing/<real id>` from a machine in India. Record
p50/p95 TTFB and requests-per-second at the point errors begin. Without those
two numbers, every claim in this document — including this one — is a guess.
