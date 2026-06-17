import { Router } from "express";
import { setlistItems } from "../data/setlist.js";

const router = Router();

const YOUTUBE_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

// Estado em memória (inicializado a partir dos dados mock)
let store = [...setlistItems];

/**
 * GET /api/setlist
 * Retorna todos os itens do Setlist
 */
router.get("/", (_req, res) => {
  res.json(store);
});

/**
 * GET /api/setlist/:id
 * Retorna um item pelo id
 */
router.get("/:id", (req, res) => {
  const item = store.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Item não encontrado." });
  res.json(item);
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
    key: key ? String(key).trim() : undefined,
    youtubeUrl: String(youtubeUrl).trim(),
    createdAt: new Date().toISOString(),
  };

  store.unshift(newItem);
  res.status(201).json(newItem);
});

/**
 * PUT /api/setlist/:id
 * Atualiza um item do Setlist
 * Body: { title?, author?, key?, youtubeUrl? }
 */
router.put("/:id", (req, res) => {
  const idx = store.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Item não encontrado." });

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

  store[idx] = {
    ...store[idx],
    ...(title !== undefined && { title: String(title).trim() }),
    ...(author !== undefined && { author: String(author).trim() }),
    ...(key !== undefined && { key: String(key).trim() || undefined }),
    ...(youtubeUrl !== undefined && { youtubeUrl: String(youtubeUrl).trim() }),
  };

  res.json(store[idx]);
});

/**
 * DELETE /api/setlist/:id
 * Remove um item do Setlist
 */
router.delete("/:id", (req, res) => {
  const idx = store.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Item não encontrado." });
  store.splice(idx, 1);
  res.status(204).end();
});

export default router;
