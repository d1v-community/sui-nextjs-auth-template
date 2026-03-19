CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  wallet_address TEXT,
  wallet_name TEXT,
  chain TEXT NOT NULL DEFAULT 'sui',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS chain TEXT NOT NULL DEFAULT 'sui';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS users_wallet_address_idx ON users (wallet_address);
