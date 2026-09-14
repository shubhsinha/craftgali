-- 0003_listings.sql
-- Real listings, their photos, and the city a storefront hands over in.

-- Where the shop is, as a slug from lib/cities.ts. The neighbourhood stays a
-- free-text display string; the city is what distance is measured between,
-- because a listing must never carry an address. §3.4
alter table storefronts add column if not exists city_slug text;

create table if not exists listings (
    id                uuid primary key default gen_random_uuid(),
    storefront_id     uuid not null references storefronts (id) on delete cascade,

    title             text not null,
    slug              text not null,
    story             text,

    price_inr         integer not null check (price_inr > 0),
    sold_for_inr      integer check (sold_for_inr > 0),

    stream            text not null check (stream in ('art', 'decor')),
    medium            text not null,
    dimensions        text not null,
    year              integer,

    materials         text,
    edition           text,
    hours             integer,
    framing           text,

    -- How it changes hands. At least one, from the same three the buyer filters on.
    handover          text[] not null default '{in-person}',

    negotiable        boolean not null default false,
    ai_assisted       boolean not null default false,

    -- draft is not visible to buyers; live counts against the plan's slots;
    -- sold and archived both free a slot but keep the row.
    status            text not null default 'live'
                      check (status in ('draft', 'live', 'sold', 'archived')),

    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now(),

    unique (storefront_id, slug)
);

create index if not exists idx_listings_storefront on listings (storefront_id);
create index if not exists idx_listings_status on listings (status);
create index if not exists idx_listings_stream on listings (stream, status);

-- Photos live in the database rather than on disk or in a bucket. That is a
-- deliberate trade for now: no object-storage dependency, nothing to configure,
-- and it survives a serverless deploy where a written file would not. Sizes are
-- capped hard on the way in, and this is the first thing to move to real object
-- storage when there is traffic worth the bill.
create table if not exists listing_photos (
    id           uuid primary key default gen_random_uuid(),
    listing_id   uuid not null references listings (id) on delete cascade,
    bytes        bytea not null,
    content_type text not null,
    width        integer,
    height       integer,
    position     integer not null default 0,
    created_at   timestamptz not null default now()
);

create index if not exists idx_listing_photos_listing on listing_photos (listing_id, position);
