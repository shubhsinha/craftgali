-- 0004_saves_reviews.sql
-- Saving a piece, and reviewing one you actually bought.

-- A save is private to the buyer. The seller is told how many people saved a
-- piece and never which people, so this table is read in aggregate on the
-- selling side and by owner on the buying side. §5.1
create table if not exists saves (
    user_id    uuid not null references users (id) on delete cascade,
    listing_id uuid not null references listings (id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, listing_id)
);

create index if not exists idx_saves_listing on saves (listing_id);
create index if not exists idx_saves_user on saves (user_id, created_at desc);

-- Who bought it, recorded when the seller marks the piece sold.
--
-- CraftGali never touches the money, so there is no transaction to hang a
-- review on. This is the substitute: the seller names the buyer at handover,
-- and that single fact is what makes a review possible. It is deliberately the
-- seller who records it — they are the one with something to lose from a bad
-- review, so they cannot invent a reviewer who will praise them without also
-- handing that person the power to do the opposite.
alter table listings add column if not exists buyer_id uuid references users (id) on delete set null;
alter table listings add column if not exists sold_at timestamptz;

create index if not exists idx_listings_buyer on listings (buyer_id);

-- One review per buyer per piece. Editable, never silently replaced.
create table if not exists reviews (
    id            uuid primary key default gen_random_uuid(),
    listing_id    uuid not null references listings (id) on delete cascade,
    storefront_id uuid not null references storefronts (id) on delete cascade,
    author_id     uuid not null references users (id) on delete cascade,
    stars         integer not null check (stars between 1 and 5),
    body          text,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now(),
    unique (listing_id, author_id)
);

create index if not exists idx_reviews_storefront on reviews (storefront_id, created_at desc);
create index if not exists idx_reviews_author on reviews (author_id);
