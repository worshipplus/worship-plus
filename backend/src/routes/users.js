import { Router } from "express";
import { users } from "../data/users.js";

const router = Router();

// Estado em memória (inicializado a partir dos dados mock)
let store = [...users];

/**
 * GET /api/users
 * Retorna todos os usuários
 */
router.get("/", (_req, res) => {
  res.json(store);
});

/**
 * GET /api/users/:id
 * Retorna um usuário pelo id
 */
router.get("/:id", (req, res) => {
  const user = store.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json(user);
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
  if (store.some((u) => u.email === String(email).trim())) {
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

  store.push(newUser);
  res.status(201).json(newUser);
});

/**
 * PUT /api/users/:id
 * Atualiza o privilégio (role) de um usuário
 * Body: { role }
 */
router.put("/:id", (req, res) => {
  const idx = store.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Usuário não encontrado." });

  const { role } = req.body;
  const validRoles = ["admin", "ministro", "team-member"];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: "Privilégio inválido.", field: "role" });
  }

  store[idx] = { ...store[idx], role };
  res.json(store[idx]);
});

/**
 * DELETE /api/users/:id
 * Remove um usuário
 */
router.delete("/:id", (req, res) => {
  const idx = store.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Usuário não encontrado." });
  store.splice(idx, 1);
  res.status(204).end();
});

export default router;
