import { useState } from "react";
import { Plus, Pencil, Trash2, Users, Lock } from "lucide-react";
import type { ScaleEntry } from "../../types/event";
import type { User } from "../../types/user";
import { ALLOWED_PAPEIS } from "../../domain/constants/scale";

const PAPEIS: string[] = [...ALLOWED_PAPEIS];

interface ScaleSectionProps {
  scale: ScaleEntry[];
  canEdit: boolean;
  allUsers: User[];
  availableUsers: User[];
  onAdd: (userId: string, userName: string, papel: string) => string | null;
  onRemove: (entryId: string) => void;
  onEditPapel: (entryId: string, papel: string) => string | null;
}

interface AddFormState {
  userId: string;
  papel: string;
}

export function ScaleSection({
  scale,
  canEdit,
  allUsers,
  availableUsers,
  onAdd,
  onRemove,
  onEditPapel,
}: ScaleSectionProps) {
  function getAllowedRoles(user: User | undefined): string[] {
    if (!user) return PAPEIS;
    const roles = [
      user.primaryScaleRole,
      ...user.secondaryScaleRoles.filter(
        (role) => role !== user.primaryScaleRole,
      ),
    ].filter(Boolean);
    return roles.length > 0 ? [...new Set(roles)] : PAPEIS;
  }

  const defaultUser = availableUsers[0];
  const defaultRoles = getAllowedRoles(defaultUser);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<AddFormState>({
    userId: defaultUser?.id ?? "",
    papel: defaultRoles[0],
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editPapel, setEditPapel] = useState(defaultRoles[0]);
  const [editError, setEditError] = useState<string | null>(null);

  function openAddForm() {
    const user = availableUsers[0];
    const roles = getAllowedRoles(user);
    setAddForm({ userId: user?.id ?? "", papel: roles[0] });
    setAddError(null);
    setShowAddForm(true);
  }

  function closeAddForm() {
    setShowAddForm(false);
    setAddForm({ userId: "", papel: defaultRoles[0] });
    setAddError(null);
  }

  function handleConfirmAdd() {
    if (!addForm.userId) {
      setAddError("Selecione um integrante.");
      return;
    }
    const user = availableUsers.find((u) => u.id === addForm.userId);
    if (!user) {
      setAddError("Integrante não encontrado.");
      return;
    }
    const errorMsg = onAdd(user.id, user.name, addForm.papel);
    if (errorMsg) {
      setAddError(errorMsg);
      return;
    }
    closeAddForm();
  }

  function openEditPapel(entry: ScaleEntry) {
    const user = allUsers.find((item) => item.id === entry.userId);
    const roles = getAllowedRoles(user);
    setEditingEntryId(entry.id);
    setEditPapel(roles.includes(entry.papel) ? entry.papel : roles[0]);
    setEditError(null);
  }

  function closeEditPapel() {
    setEditingEntryId(null);
    setEditError(null);
  }

  function handleConfirmEditPapel() {
    if (editingEntryId) {
      const errorMsg = onEditPapel(editingEntryId, editPapel);
      if (errorMsg) {
        setEditError(errorMsg);
        return;
      }
    }
    closeEditPapel();
  }

  return (
    <section aria-labelledby="scale-heading">
      <div className="glass-card p-4 grid gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Users size={18} style={{ color: "var(--color-primary)" }} />
          <h2
            id="scale-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-base)",
            }}
          >
            Escala
          </h2>
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
            }}
          >
            {scale.length} {scale.length === 1 ? "integrante" : "integrantes"}
          </span>
          {canEdit ? (
            <button
              type="button"
              onClick={openAddForm}
              aria-label="Adicionar integrante à escala"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-neutral-50)",
              }}
            >
              <Plus size={13} />
              Adicionar
            </button>
          ) : (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-secondary)",
              }}
              title="Apenas Admin ou Owner do Evento podem editar a escala"
            >
              <Lock size={11} />
              Somente leitura
            </span>
          )}
        </div>

        {/* Scale list */}
        {scale.length === 0 ? (
          <p
            className="text-center py-4 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Nenhum integrante na escala ainda.
          </p>
        ) : (
          <ul className="grid gap-2" role="list">
            {scale.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "var(--color-surface)" }}
              >
                <div className="min-w-0 flex-1 grid gap-0.5">
                  <span
                    className="font-semibold text-sm truncate"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {entry.userName}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full self-start font-medium"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      color: "rgb(99,102,241)",
                    }}
                  >
                    {entry.papel}
                  </span>
                </div>
                {canEdit && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditPapel(entry)}
                      aria-label={`Editar papel de ${entry.userName}`}
                      className="p-1.5 rounded-full transition-opacity hover:opacity-70"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(entry.id)}
                      aria-label={`Remover ${entry.userName} da escala`}
                      className="p-1.5 rounded-full transition-opacity hover:opacity-70"
                      style={{ color: "rgb(239,68,68)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal: Adicionar integrante */}
      {showAddForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Adicionar integrante à escala"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="glass-card w-full max-w-sm p-5 grid gap-4">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Adicionar à Escala
            </h3>

            {availableUsers.length === 0 ? (
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Todos os usuários já estão na escala.
              </p>
            ) : (
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <label
                    htmlFor="scale-user"
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Integrante *
                  </label>
                  <select
                    id="scale-user"
                    value={addForm.userId}
                    onChange={(e) =>
                      setAddForm(() => {
                        const selectedUser = availableUsers.find(
                          (user) => user.id === e.target.value,
                        );
                        const selectedRoles = getAllowedRoles(selectedUser);
                        return {
                          userId: e.target.value,
                          papel: selectedRoles[0],
                        };
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: addError
                        ? "rgb(239,68,68)"
                        : "rgba(255,255,255,0.15)",
                    }}
                    aria-describedby={addError ? "scale-user-error" : undefined}
                    aria-invalid={!!addError}
                  >
                    <option value="">Selecione…</option>
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {addError && (
                    <span
                      id="scale-user-error"
                      className="text-xs text-red-500"
                      role="alert"
                    >
                      {addError}
                    </span>
                  )}
                </div>

                <div className="grid gap-1">
                  <label
                    htmlFor="scale-papel"
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Papel *
                  </label>
                  <select
                    id="scale-papel"
                    value={addForm.papel}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, papel: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "rgba(255,255,255,0.15)",
                    }}
                  >
                    {getAllowedRoles(
                      availableUsers.find((u) => u.id === addForm.userId),
                    ).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeAddForm}
                className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Cancelar
              </button>
              {availableUsers.length > 0 && (
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-neutral-50)",
                  }}
                >
                  Adicionar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar papel */}
      {editingEntryId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Editar papel na escala"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="glass-card w-full max-w-sm p-5 grid gap-4">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Editar Papel
            </h3>

            <div className="grid gap-1">
              <label
                htmlFor="edit-papel"
                className="text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Papel *
              </label>
              <select
                id="edit-papel"
                value={editPapel}
                onChange={(e) => setEditPapel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                {getAllowedRoles(
                  allUsers.find(
                    (user) =>
                      user.id ===
                      scale.find((entry) => entry.id === editingEntryId)
                        ?.userId,
                  ),
                ).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {editError && (
                <span className="text-xs text-red-500" role="alert">
                  {editError}
                </span>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeEditPapel}
                className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmEditPapel}
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
    </section>
  );
}

export default ScaleSection;
