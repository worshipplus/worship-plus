import { useState } from "react";
import { Plus, Pencil, X, Users } from "lucide-react";
import type { UserRole, User } from "../../types/user";
import { useAuth } from "../../context/auth";
import { mockUsers } from "../../mocks/userMocks";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  ministro: "Ministro",
  "team-member": "Membro",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "var(--color-primary)",
  ministro: "#10b981",
  "team-member": "#6b7280",
};

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
}

const emptyForm: UserFormData = { name: "", email: "", role: "team-member" };

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: ROLE_COLORS[role],
        color: "var(--color-neutral-50)",
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

interface FormErrors {
  name?: string;
  email?: string;
}

function validate(data: UserFormData): FormErrors {
  const errs: FormErrors = {};
  if (!data.name.trim()) errs.name = "Nome é obrigatório.";
  if (!data.email.trim()) {
    errs.email = "E-mail é obrigatório.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errs.email = "Insira um e-mail válido.";
  }
  return errs;
}

export function UsersPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [editRole, setEditRole] = useState<UserRole>("team-member");
  const [errors, setErrors] = useState<FormErrors>({});

  const isAdmin = currentUser?.role === "admin";

  function openNewUser() {
    setForm(emptyForm);
    setErrors({});
    setShowNewForm(true);
  }

  function closeNewForm() {
    setShowNewForm(false);
    setForm(emptyForm);
    setErrors({});
  }

  function handleSaveNewUser() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const newUser: User = {
      id: String(Date.now()),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    closeNewForm();
  }

  function openEditPrivilege(user: User) {
    setEditingUserId(user.id);
    setEditRole(user.role);
  }

  function closeEditPrivilege() {
    setEditingUserId(null);
  }

  function handleSavePrivilege() {
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUserId ? { ...u, role: editRole } : u)),
    );
    closeEditPrivilege();
  }

  function handleFormChange(field: keyof UserFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field !== "role" && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto grid gap-4">
        {/* Header */}
        <header className="glass-card p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Users size={22} style={{ color: "var(--color-primary)" }} />
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-weight-extrabold)",
                }}
              >
                Usuários
              </h1>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Gestão de usuários e privilégios
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={openNewUser}
              aria-label="Novo Usuário"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-transform active:scale-95"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-neutral-50)",
                minHeight: "40px",
              }}
            >
              <Plus size={16} />
              Novo Usuário
            </button>
          )}
        </header>

        {/* User List */}
        <ul className="grid gap-3" role="list">
          {users.map((user) => (
            <li key={user.id} className="glass-card p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="grid gap-0.5 min-w-0">
                  <span
                    className="font-semibold truncate"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {user.name}
                  </span>
                  <span
                    className="text-sm truncate"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <RoleBadge role={user.role} />
                  {isAdmin && user.id !== currentUser?.id && (
                    <button
                      type="button"
                      onClick={() => openEditPrivilege(user)}
                      aria-label={`Editar Privilégio de ${user.name}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <Pencil size={12} />
                      Editar Privilégio
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal: Novo Usuário */}
      {showNewForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Novo Usuário"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="glass-card w-full max-w-md p-5 grid gap-4">
            <div className="flex items-center justify-between">
              <h2
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                Novo Usuário
              </h2>
              <button
                type="button"
                onClick={closeNewForm}
                aria-label="Fechar formulário"
                className="p-1 rounded-full hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <label
                  htmlFor="user-name"
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Nome *
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: errors.name
                      ? "rgb(239 68 68)"
                      : "rgba(255,255,255,0.15)",
                  }}
                  aria-describedby={errors.name ? "user-name-error" : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span
                    id="user-name-error"
                    className="text-xs text-red-500"
                    role="alert"
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="user-email"
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  E-mail *
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: errors.email
                      ? "rgb(239 68 68)"
                      : "rgba(255,255,255,0.15)",
                  }}
                  aria-describedby={
                    errors.email ? "user-email-error" : undefined
                  }
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span
                    id="user-email-error"
                    className="text-xs text-red-500"
                    role="alert"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="user-role"
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Privilégio *
                </label>
                <select
                  id="user-role"
                  value={form.role}
                  onChange={(e) =>
                    handleFormChange("role", e.target.value as UserRole)
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="ministro">Ministro</option>
                  <option value="team-member">Membro</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeNewForm}
                className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveNewUser}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-neutral-50)",
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Privilégio */}
      {editingUserId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Editar Privilégio"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="glass-card w-full max-w-sm p-5 grid gap-4">
            <div className="flex items-center justify-between">
              <h2
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                Editar Privilégio
              </h2>
              <button
                type="button"
                onClick={closeEditPrivilege}
                aria-label="Fechar formulário"
                className="p-1 rounded-full hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-1">
              <label
                htmlFor="edit-role"
                className="text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Privilégio
              </label>
              <select
                id="edit-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <option value="admin">Admin</option>
                <option value="ministro">Ministro</option>
                <option value="team-member">Membro</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeEditPrivilege}
                className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePrivilege}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-neutral-50)",
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
