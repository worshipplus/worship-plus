import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { users as seedUsers } from "./data/users.js";
import { setlistItems as seedSetlist } from "./data/setlist.js";
import { events as seedEvents } from "./data/events.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH ?? join(__dirname, "..", "worship-plus.db");

let _db;

/**
 * Retorna a instância singleton do banco SQLite.
 * @returns {import('better-sqlite3').Database}
 */
export function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
  }
  return _db;
}

/**
 * Executa as migrations e faz seed dos dados mock caso as tabelas estejam vazias.
 */
export function initDb() {
  const db = getDb();

  const migrationSql = readFileSync(
    join(__dirname, "..", "migrations", "001_init.sql"),
    "utf-8"
  );
  db.exec(migrationSql);

  seedIfEmpty(db);
}

function seedIfEmpty(db) {
  const userCount = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, role, primary_scale_role, secondary_scale_roles, created_at)
      VALUES (@id, @name, @email, @role, @primaryScaleRole, @secondaryScaleRoles, @createdAt)
    `);
    const insertManyUsers = db.transaction((rows) => {
      for (const u of rows) {
        insertUser.run({
          ...u,
          secondaryScaleRoles: JSON.stringify(u.secondaryScaleRoles ?? []),
        });
      }
    });
    insertManyUsers(seedUsers);
  }

  const setlistCount = db.prepare("SELECT COUNT(*) AS c FROM setlist_items").get().c;
  if (setlistCount === 0) {
    const insertItem = db.prepare(`
      INSERT INTO setlist_items (id, title, author, key, youtube_url, created_at)
      VALUES (@id, @title, @author, @key, @youtubeUrl, @createdAt)
    `);
    const insertManyItems = db.transaction((rows) => {
      for (const s of rows) {
        insertItem.run({ ...s, key: s.key ?? null });
      }
    });
    insertManyItems(seedSetlist);
  }

  const eventCount = db.prepare("SELECT COUNT(*) AS c FROM events").get().c;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, date, status, owner, owner_id, description, event_setlist, scale, created_at)
      VALUES (@id, @title, @date, @status, @owner, @owner_id, @description, @eventSetlist, @scale, @createdAt)
    `);
    const insertManyEvents = db.transaction((rows) => {
      for (const e of rows) {
        insertEvent.run({
          ...e,
          eventSetlist: JSON.stringify(e.eventSetlist ?? []),
          scale: JSON.stringify(e.scale ?? []),
          createdAt: e.createdAt ?? new Date().toISOString(),
        });
      }
    });
    insertManyEvents(seedEvents);
  }
}

/**
 * Converte uma linha da tabela `users` para o formato da API.
 */
export function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    primaryScaleRole: row.primary_scale_role,
    secondaryScaleRoles: JSON.parse(row.secondary_scale_roles),
    createdAt: row.created_at,
  };
}

/**
 * Converte uma linha da tabela `setlist_items` para o formato da API.
 */
export function rowToSetlistItem(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    key: row.key ?? undefined,
    youtubeUrl: row.youtube_url,
    createdAt: row.created_at,
  };
}

/**
 * Converte uma linha da tabela `events` para o formato da API.
 */
export function rowToEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    status: row.status,
    owner: row.owner,
    owner_id: row.owner_id,
    description: row.description,
    eventSetlist: JSON.parse(row.event_setlist),
    scale: JSON.parse(row.scale),
  };
}
