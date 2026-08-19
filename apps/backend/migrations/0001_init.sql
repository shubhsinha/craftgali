-- 0001_init.sql
-- Shared buyer/seller accounts + seller storefronts.

create table if not exists users (
    id               uuid primary key default gen_random_uuid(),
    email            text not null unique,
    phone            text unique,
    password_hash    text,
    google_id        text unique,
    full_name        text not null,
    city             text,
    pincode          text,
    delivery_address text,
    role             text not null default 'buyer' check (role in ('buyer', 'seller')),
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

create table if not exists storefronts (
    id                   uuid primary key default gen_random_uuid(),
    owner_id             uuid not null unique references users (id) on delete cascade,
    name                 text not null,
    handle               text not null unique,
    categories           text[] not null default '{}',
    pickup_neighborhood  text not null,
    status               text not null default 'active'
                         check (status in ('active', 'paused', 'closed')),
    created_at           timestamptz not null default now(),
    updated_at           timestamptz not null default now()
);

create index if not exists idx_users_role on users (role);
create index if not exists idx_storefronts_owner on storefronts (owner_id);
