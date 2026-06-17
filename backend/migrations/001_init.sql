-- Migration 001: tabelas iniciais do Worship+

CREATE TABLE IF NOT EXISTS users (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL UNIQUE,
  role                  TEXT NOT NULL CHECK(role IN ('admin', 'ministro', 'team-member')),
  primary_scale_role    TEXT NOT NULL DEFAULT 'Outro',
  secondary_scale_roles TEXT NOT NULL DEFAULT '[]',  -- JSON array
  created_at            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS setlist_items (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  key         TEXT,
  youtube_url TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  date           TEXT NOT NULL,
  status         TEXT NOT NULL CHECK(status IN ('draft', 'scheduled', 'locked')) DEFAULT 'draft',
  owner          TEXT NOT NULL,
  owner_id       TEXT NOT NULL,
  description    TEXT NOT NULL,
  event_setlist  TEXT NOT NULL DEFAULT '[]',  -- JSON array
  scale          TEXT NOT NULL DEFAULT '[]',  -- JSON array
  created_at     TEXT NOT NULL
);
