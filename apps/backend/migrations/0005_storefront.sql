-- 0005_storefront.sql
-- What a shop can say about itself, the skin it publishes, who follows it —
-- and the indexes the feed needs before it is asked to scale.

-- Words. Both optional; both are the maker's own, rendered verbatim.
alter table storefronts add column if not exists tagline text;
alter table storefronts add column if not exists bio text;

-- The published skin. Until now the editor could only draft; these are what
-- the public page reads. `heritage` is the four ornament toggles as jsonb so a
-- fifth can be added without a migration.
alter table storefronts add column if not exists skin text not null default 'indigo'
    check (skin in ('indigo', 'ruby', 'pink', 'teal'));
alter table storefronts add column if not exists mode text not null default 'light'
    check (mode in ('light', 'dark'));
alter table storefronts add column if not exists heritage jsonb not null
    default '{"tapestry":true,"medallion":true,"toran":false,"jali":true}'::jsonb;

-- Cover and avatar, stored the same way listing photos are and for the same
-- reason: nothing to configure, survives a redeploy. Same caveat too — this is
-- the second thing to move to object storage.
create table if not exists storefront_media (
    id            uuid primary key default gen_random_uuid(),
    storefront_id uuid not null references storefronts (id) on delete cascade,
    kind          text not null check (kind in ('cover', 'avatar')),
    bytes         bytea not null,
    content_type  text not null,
    created_at    timestamptz not null default now(),
    unique (storefront_id, kind)
);

-- Following a shop. Like saves: the buyer owns the list, the seller sees a
-- count. There is deliberately no query that lists a shop's followers by name.
create table if not exists follows (
    user_id       uuid not null references users (id) on delete cascade,
    storefront_id uuid not null references storefronts (id) on delete cascade,
    created_at    timestamptz not null default now(),
    primary key (user_id, storefront_id)
);

create index if not exists idx_follows_storefront on follows (storefront_id);

-- The feed filters by city, status and stream, sorts by recency, and pages.
-- Without these it is a sequential scan per request, which is fine for a
-- hundred listings and a disaster for a hundred thousand.
create index if not exists idx_listings_feed
    on listings (status, stream, created_at desc)
    where status in ('live', 'sold');

create index if not exists idx_storefronts_city on storefronts (city_slug)
    where status = 'active';

-- The throttle table is written on every auth attempt and only ever read for
-- one bucket over a short window. Expired rows are pure weight; the index lets
-- the sweep find them without a scan.
create index if not exists idx_auth_attempts_expiry on auth_attempts (occurred_at);
