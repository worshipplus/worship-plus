import { Router } from "express";
import { getDb, rowToEvent } from "../db.js";

const router = Router();

/**
 * GET /api/events
 * Retorna todos os eventos
 */
router.get("/", (_req, res) => {
  const rows = getDb().prepare("SELECT * FROM events ORDER BY date DESC").all();
  res.json(rows.map(rowToEvent));
});

/**
 * GET /api/events/:id
 * Retorna um evento pelo id
 */
router.get("/:id", (req, res) => {
  const row = getDb().prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });
  res.json(rowToEvent(row));
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

  getDb().prepare(`
    INSERT INTO events (id, title, date, status, owner, owner_id, description, event_setlist, scale, created_at)
    VALUES (@id, @title, @date, @status, @owner, @owner_id, @description, @eventSetlist, @scale, @createdAt)
  `).run({
    ...newEvent,
    eventSetlist: JSON.stringify(newEvent.eventSetlist),
    scale: JSON.stringify(newEvent.scale),
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newEvent);
});

/**
 * PUT /api/events/:id
 * Atualiza campos de um evento (title, date, description, status, owner, owner_id)
 */
router.put("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });

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

  const updated = {
    title: title !== undefined ? String(title).trim() : row.title,
    date: date !== undefined ? new Date(date).toISOString() : row.date,
    description: description !== undefined ? String(description).trim() : row.description,
    status: status !== undefined ? status : row.status,
    owner: owner !== undefined ? String(owner).trim() : row.owner,
    owner_id: owner_id !== undefined ? String(owner_id).trim() : row.owner_id,
  };

  db.prepare(`
    UPDATE events SET title = @title, date = @date, description = @description,
      status = @status, owner = @owner, owner_id = @owner_id
    WHERE id = @id
  `).run({ ...updated, id: req.params.id });

  const result = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.json(rowToEvent(result));
});

/**
 * POST /api/events/:id/setlist
 * Adiciona um item ao Event Setlist
 * Body: { id, title, author, key?, youtubeUrl }
 */
router.post("/:id/setlist", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });

  const { id, title, author, key, youtubeUrl } = req.body;
  if (!id || !title || !author || !youtubeUrl) {
    return res.status(400).json({ error: "Campos obrigatórios: id, title, author, youtubeUrl." });
  }

  const eventSetlist = JSON.parse(row.event_setlist);
  eventSetlist.push({ id: String(id), title: String(title), author: String(author), key, youtubeUrl: String(youtubeUrl) });

  db.prepare("UPDATE events SET event_setlist = ? WHERE id = ?").run(JSON.stringify(eventSetlist), req.params.id);
  const result = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.status(201).json(rowToEvent(result));
});

/**
 * DELETE /api/events/:id/setlist/:itemId
 * Remove um item do Event Setlist
 */
router.delete("/:id/setlist/:itemId", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });

  const eventSetlist = JSON.parse(row.event_setlist).filter((s) => s.id !== req.params.itemId);
  db.prepare("UPDATE events SET event_setlist = ? WHERE id = ?").run(JSON.stringify(eventSetlist), req.params.id);
  const result = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.json(rowToEvent(result));
});

/**
 * POST /api/events/:id/scale
 * Adiciona um membro à escala do evento
 * Body: { id, userId, userName, papel }
 */
router.post("/:id/scale", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });

  const { id, userId, userName, papel } = req.body;
  if (!id || !userId || !userName || !papel) {
    return res.status(400).json({ error: "Campos obrigatórios: id, userId, userName, papel." });
  }

  const scale = JSON.parse(row.scale);
  scale.push({ id: String(id), userId: String(userId), userName: String(userName), papel: String(papel) });

  db.prepare("UPDATE events SET scale = ? WHERE id = ?").run(JSON.stringify(scale), req.params.id);
  const result = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.status(201).json(rowToEvent(result));
});

/**
 * DELETE /api/events/:id/scale/:entryId
 * Remove um membro da escala do evento
 */
router.delete("/:id/scale/:entryId", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });

  const scale = JSON.parse(row.scale).filter((s) => s.id !== req.params.entryId);
  db.prepare("UPDATE events SET scale = ? WHERE id = ?").run(JSON.stringify(scale), req.params.id);
  const result = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.json(rowToEvent(result));
});

/**
 * DELETE /api/events/:id
 * Remove um evento
 */
router.delete("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT id FROM events WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Evento não encontrado." });
  db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;
