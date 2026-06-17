import { Router } from "express";
import { events } from "../data/events.js";

const router = Router();

// Estado em memória (inicializado a partir dos dados mock)
let store = events.map((e) => ({
  ...e,
  eventSetlist: [...e.eventSetlist],
  scale: [...e.scale],
}));

/**
 * GET /api/events
 * Retorna todos os eventos
 */
router.get("/", (_req, res) => {
  res.json(store);
});

/**
 * GET /api/events/:id
 * Retorna um evento pelo id
 */
router.get("/:id", (req, res) => {
  const event = store.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: "Evento não encontrado." });
  res.json(event);
});

/**
 * POST /api/events
 * Cria um novo evento
 * Body: { title, date, description, owner, owner_id }
 */
router.post("/", (req, res) => {
  const { title, date, description, owner, owner_id } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Título é obrigatório.", field: "title" });
  }
  if (!date || !String(date).trim()) {
    return res.status(400).json({ error: "Data e hora são obrigatórias.", field: "date" });
  }
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Data e hora inválidas.", field: "date" });
  }
  if (!description || !String(description).trim()) {
    return res.status(400).json({ error: "Descrição é obrigatória.", field: "description" });
  }
  if (!owner || !String(owner).trim()) {
    return res.status(400).json({ error: "Owner é obrigatório.", field: "owner" });
  }
  if (!owner_id || !String(owner_id).trim()) {
    return res.status(400).json({ error: "owner_id é obrigatório.", field: "owner_id" });
  }

  const newEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: String(title).trim(),
    date: parsedDate.toISOString(),
    status: "draft",
    owner: String(owner).trim(),
    owner_id: String(owner_id).trim(),
    description: String(description).trim(),
    eventSetlist: [],
    scale: [],
  };

  store.unshift(newEvent);
  res.status(201).json(newEvent);
});

/**
 * PUT /api/events/:id
 * Atualiza campos de um evento (title, date, description, status, owner, owner_id)
 */
router.put("/:id", (req, res) => {
  const idx = store.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Evento não encontrado." });

  const { title, date, description, status, owner, owner_id } = req.body;
  const validStatuses = ["draft", "scheduled", "locked"];

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Status inválido.", field: "status" });
  }
  if (date !== undefined) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ error: "Data e hora inválidas.", field: "date" });
    }
  }

  store[idx] = {
    ...store[idx],
    ...(title !== undefined && { title: String(title).trim() }),
    ...(date !== undefined && { date: new Date(date).toISOString() }),
    ...(description !== undefined && { description: String(description).trim() }),
    ...(status !== undefined && { status }),
    ...(owner !== undefined && { owner: String(owner).trim() }),
    ...(owner_id !== undefined && { owner_id: String(owner_id).trim() }),
  };

  res.json(store[idx]);
});

/**
 * POST /api/events/:id/setlist
 * Adiciona um item ao Event Setlist
 * Body: { id, title, author, key?, youtubeUrl }
 */
router.post("/:id/setlist", (req, res) => {
  const idx = store.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Evento não encontrado." });

  const { id, title, author, key, youtubeUrl } = req.body;
  if (!id || !title || !author || !youtubeUrl) {
    return res.status(400).json({ error: "Campos obrigatórios: id, title, author, youtubeUrl." });
  }

  const item = { id: String(id), title: String(title), author: String(author), key, youtubeUrl: String(youtubeUrl) };
  store[idx].eventSetlist.push(item);
  res.status(201).json(store[idx]);
});

/**
 * DELETE /api/events/:id/setlist/:itemId
 * Remove um item do Event Setlist
 */
router.delete("/:id/setlist/:itemId", (req, res) => {
  const idx = store.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Evento não encontrado." });

  store[idx].eventSetlist = store[idx].eventSetlist.filter((s) => s.id !== req.params.itemId);
  res.json(store[idx]);
});

/**
 * POST /api/events/:id/scale
 * Adiciona um membro à escala do evento
 * Body: { id, userId, userName, papel }
 */
router.post("/:id/scale", (req, res) => {
  const idx = store.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Evento não encontrado." });

  const { id, userId, userName, papel } = req.body;
  if (!id || !userId || !userName || !papel) {
    return res.status(400).json({ error: "Campos obrigatórios: id, userId, userName, papel." });
  }

  const entry = { id: String(id), userId: String(userId), userName: String(userName), papel: String(papel) };
  store[idx].scale.push(entry);
  res.status(201).json(store[idx]);
});

/**
 * DELETE /api/events/:id/scale/:entryId
 * Remove um membro da escala do evento
 */
router.delete("/:id/scale/:entryId", (req, res) => {
  const idx = store.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Evento não encontrado." });

  store[idx].scale = store[idx].scale.filter((s) => s.id !== req.params.entryId);
  res.json(store[idx]);
});

/**
 * DELETE /api/events/:id
 * Remove um evento
 */
router.delete("/:id", (req, res) => {
  const idx = store.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Evento não encontrado." });
  store.splice(idx, 1);
  res.status(204).end();
});

export default router;
