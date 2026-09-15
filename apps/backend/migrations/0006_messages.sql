-- 0006_messages.sql
-- Chat between a buyer and a shop. This is the one surface that must never
-- leave the platform: the price is agreed here and the handover arranged here,
-- and a conversation that moves to another number straight away is the shape
-- most scams take. §3.4

-- One thread per buyer, per shop, per piece. A general enquiry has no piece;
-- `nulls not distinct` (PG15+) keeps that to one thread too.
create table if not exists threads (
    id              uuid primary key default gen_random_uuid(),
    storefront_id   uuid not null references storefronts (id) on delete cascade,
    buyer_id        uuid not null references users (id) on delete cascade,
    listing_id      uuid references listings (id) on delete set null,
    -- Denormalised so the inbox can say what a thread is about without a join,
    -- and so a comp piece (no listing row) still has a subject.
    subject         text,
    created_at      timestamptz not null default now(),
    last_message_at timestamptz not null default now(),
    unique nulls not distinct (storefront_id, buyer_id, listing_id)
);

create table if not exists messages (
    id         uuid primary key default gen_random_uuid(),
    thread_id  uuid not null references threads (id) on delete cascade,
    sender_id  uuid not null references users (id) on delete cascade,
    body       text not null check (length(body) between 1 and 2000),
    created_at timestamptz not null default now(),
    -- Read by the *other* participant. There are exactly two, so one column.
    read_at    timestamptz
);

create index if not exists idx_messages_thread on messages (thread_id, created_at);
create index if not exists idx_threads_shop  on threads (storefront_id, last_message_at desc);
create index if not exists idx_threads_buyer on threads (buyer_id, last_message_at desc);
-- Unread counts: "messages in my threads, not from me, not yet read".
create index if not exists idx_messages_unread on messages (thread_id) where read_at is null;

-- Every insert bumps the thread and tells anyone listening. Doing it in a
-- trigger rather than in the action means it happens however the row got
-- there — a seed, a future API, a repair by hand — and every app replica hears
-- it, because NOTIFY is delivered to every connection that LISTENs.
create or replace function messages_after_insert() returns trigger
language plpgsql as $$
begin
  update threads set last_message_at = new.created_at where id = new.thread_id;
  perform pg_notify(
    'cg_message',
    json_build_object('t', new.thread_id, 'm', new.id, 's', new.sender_id)::text
  );
  return new;
end $$;

drop trigger if exists trg_messages_after_insert on messages;
create trigger trg_messages_after_insert
  after insert on messages
  for each row execute function messages_after_insert();
