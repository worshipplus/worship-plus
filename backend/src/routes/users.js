import { Router } from "express";
import { getDb, rowToUser } from "../db.js";

const router = Router();

/**
 * GET /api/users
 * Retorna todos os usuários
 */
router.get("/", (_req, res) => {
  const rows = getDb().prepare("SELECT * FROM users ORDER BY created_at ASC").all();
  res.json(rows.map(rowToUser));
});

/**
 * GET /api/users/:id
 * Retorna um usuário pelo id
 */
router.get("/:id", (req, res) => {
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json(rowToUser(row));
});

/**
 * POST /api/users
 * Cadastra um novo usuário
 * Body: { name, email, role, primaryScaleRole?, secondaryScaleRoles? }
 */
router.post("/", (req, res) => {
  const { name, email, role, primaryScaleRole, secondaryScaleRoles } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Nome é obrigatório.", field: "name" });
  }
  if (!email || !String(email).trim()) {
    return res.status(400).json({ error: "E-mail é obrigatório.", field: "email" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return res.status(400).json({ error: "E-mail inválido.", field: "email" });
  }
  const validRoles = ["admin", "ministro", "team-member"];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: "Privilégio inválido.", field: "role" });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(String(email).trim());
  if (existing) {
    return res.status(409).json({ error: "E-mail já cadastrado.", field: "email" });
  }

  const newUser = {
    id: `u${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    role,
    primaryScaleRole: primaryScaleRole ? String(primaryScaleRole).trim() : "Outro",
    secondaryScaleRoles: Array.isArray(secondaryScaleRoles) ? secondaryScaleRoles : [],
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO users (id, name, email, role, primary_scale_role, secondary_scale_roles, created_at)
    VALUES (@id, @name, @email, @role, @primaryScaleRole, @secondaryScaleRoles, @createdAt)
  `).run({
    ...newUser,
    secondaryScaleRoles: JSON.stringify(newUser.secondaryScaleRoles),
  });

  res.status(201).json(newUser);
});

/**
 * PUT /api/users/:id
 * Atualiza o privilégio (role) de um usuário
 * Body: { role }
 */
router.put("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Usuário não encontrado." });

  const { role } = req.body;
  const validRoles = ["admin", "ministro", "team-member"];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: "Privilégio inválido.", field: "role" });
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  res.json(rowToUser(updated));
});

/**
 * DELETE /api/users/:id
 * Remove um usuário
 */
router.delete("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT id FROM users WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Usuário não encontrado." });
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;
