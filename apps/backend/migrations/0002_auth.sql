-- 0002_auth.sql
-- Password resets, brute-force throttling, and bulk session revocation.

-- Bumping this invalidates every session token already issued for the user.
-- The session cookie carries the value it was minted with, and currentUser()
-- rejects any token whose value is stale — so a password change or a "sign out
-- everywhere" takes effect immediately, without a server-side session store.
alter table users add column if not exists session_version integer not null default 1;

-- One row per reset request. The raw token only ever exists in the emailed
-- link: what is stored is its SHA-256, so a leaked database read cannot be
-- turned into an account takeover.
create table if not exists password_resets (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references users (id) on delete cascade,
    token_hash  text not null unique,
    expires_at  timestamptz not null,
    used_at     timestamptz,
    created_at  timestamptz not null default now()
);

create index if not exists idx_password_resets_user on password_resets (user_id);
create index if not exists idx_password_resets_expiry on password_resets (expires_at);

-- The throttle log: one row per attempt at a rate-limited action, keyed by
-- whatever the limit counts (an email, an IP, or both). Counting rows in a
-- window is cheap with this index, and expired rows are swept on write rather
-- than by a scheduled job.
create table if not exists auth_attempts (
    id          bigserial primary key,
    bucket      text not null,
    occurred_at timestamptz not null default now()
);

create index if not exists idx_auth_attempts_bucket on auth_attempts (bucket, occurred_at desc);
