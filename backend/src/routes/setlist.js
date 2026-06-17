import { Router } from "express";
import { getDb, rowToSetlistItem } from "../db.js";

const router = Router();

const YOUTUBE_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

/**
 * GET /api/setlist
 * Retorna todos os itens do Setlist
 */
router.get("/", (_req, res) => {
  const rows = getDb().prepare("SELECT * FROM setlist_items ORDER BY created_at DESC").all();
  res.json(rows.map(rowToSetlistItem));
});

/**
 * GET /api/setlist/:id
 * Retorna um item pelo id
 */
router.get("/:id", (req, res) => {
  const row = getDb().prepare("SELECT * FROM setlist_items WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Item não encontrado." });
  res.json(rowToSetlistItem(row));
});

/**
 * POST /api/setlist
 * Adiciona um novo item ao Setlist
 * Body: { title, author, key?, youtubeUrl }
 */
router.post("/", (req, res) => {
  const { title, author, key, youtubeUrl } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Título é obrigatório.", field: "title" });
  }
  if (!author || !String(author).trim()) {
    return res.status(400).json({ error: "Autor é obrigatório.", field: "author" });
  }
  if (!youtubeUrl || !String(youtubeUrl).trim()) {
    return res.status(400).json({ error: "Link do YouTube é obrigatório.", field: "youtubeUrl" });
  }
  if (!YOUTUBE_REGEX.test(String(youtubeUrl).trim())) {
    return res.status(400).json({ error: "Insira um link válido do YouTube.", field: "youtubeUrl" });
  }

  const newItem = {
    id: String(Date.now()),
    title: String(title).trim(),
    author: String(author).trim(),
    key: key ? String(key).trim() : null,
    youtubeUrl: String(youtubeUrl).trim(),
    createdAt: new Date().toISOString(),
  };

  getDb().prepare(`
    INSERT INTO setlist_items (id, title, author, key, youtube_url, created_at)
    VALUES (@id, @title, @author, @key, @youtubeUrl, @createdAt)
  `).run(newItem);

  res.status(201).json({ ...newItem, key: newItem.key ?? undefined });
});

/**
 * PUT /api/setlist/:id
 * Atualiza um item do Setlist
 * Body: { title?, author?, key?, youtubeUrl? }
 */
router.put("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM setlist_items WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Item não encontrado." });

  const { title, author, key, youtubeUrl } = req.body;

  if (title !== undefined && !String(title).trim()) {
    return res.status(400).json({ error: "Título é obrigatório.", field: "title" });
  }
  if (author !== undefined && !String(author).trim()) {
    return res.status(400).json({ error: "Autor é obrigatório.", field: "author" });
  }
  if (youtubeUrl !== undefined) {
    if (!String(youtubeUrl).trim()) {
      return res.status(400).json({ error: "Link do YouTube é obrigatório.", field: "youtubeUrl" });
    }
    if (!YOUTUBE_REGEX.test(String(youtubeUrl).trim())) {
      return res.status(400).json({ error: "Insira um link válido do YouTube.", field: "youtubeUrl" });
    }
  }

  const updated = {
    title: title !== undefined ? String(title).trim() : row.title,
    author: author !== undefined ? String(author).trim() : row.author,
    key: key !== undefined ? (String(key).trim() || null) : row.key,
    youtube_url: youtubeUrl !== undefined ? String(youtubeUrl).trim() : row.youtube_url,
  };

  db.prepare(`
    UPDATE setlist_items SET title = @title, author = @author, key = @key, youtube_url = @youtube_url
    WHERE id = @id
  `).run({ ...updated, id: req.params.id });

  const result = db.prepare("SELECT * FROM setlist_items WHERE id = ?").get(req.params.id);
  res.json(rowToSetlistItem(result));
});

/**
 * DELETE /api/setlist/:id
 * Remove um item do Setlist
 */
router.delete("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT id FROM setlist_items WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Item não encontrado." });
  db.prepare("DELETE FROM setlist_items WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;
