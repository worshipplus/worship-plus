import { useState, useEffect } from "react";
import { ExternalLink, Plus, Pencil, Trash2, X, Music } from "lucide-react";
import type {
  UserRole,
  SetlistItem,
  SetlistFormData,
} from "../../types/setlist";
import { useSearchSetlist } from "../../hooks/useSearchSetlist";
import { AddSetlistItemUseCase } from "../../usecases/setlist/AddSetlistItemUseCase";
import { EditSetlistItemUseCase } from "../../usecases/setlist/EditSetlistItemUseCase";
import { RemoveSetlistItemUseCase } from "../../usecases/setlist/RemoveSetlistItemUseCase";
import { DomainError } from "../../domain/errors/DomainError";

interface SetlistPageProps {
  userRole?: UserRole;
}

const emptyForm: SetlistFormData = {
  title: "",
  author: "",
  key: "",
  youtubeUrl: "",
};

export function SetlistPage({ userRole = "team-member" }: SetlistPageProps) {
  const { data: sourceItems } = useSearchSetlist("");
  const [items, setItems] = useState<SetlistItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SetlistFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<SetlistFormData>>({});

  useEffect(() => {
    if (!initialized && sourceItems.length > 0) {
      setItems(sourceItems);
      setInitialized(true);
    }
  }, [sourceItems, initialized]);

  const canEdit = userRole === "admin" || userRole === "ministro";

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(item: SetlistItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      author: item.author,
      key: item.key ?? "",
      youtubeUrl: item.youtubeUrl,
    });
    setErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  function handleSave() {
    try {
      if (editingId) {
        const updated = new EditSetlistItemUseCase().execute(userRole, form);
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...updated } : item,
          ),
        );
      } else {
        const newItem = new AddSetlistItemUseCase().execute(userRole, form);
        setItems((prev) => [newItem, ...prev]);
      }
      closeForm();
    } catch (err) {
      if (err instanceof DomainError) {
        const field =
          typeof err.details?.field === "string" ? err.details.field : null;
        if (field) {
          setErrors({ [field]: err.message });
        }
      }
    }
  }

  function handleRemove(id: string) {
    try {
      new RemoveSetlistItemUseCase().execute(userRole);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      if (!(err instanceof DomainError)) throw err;
      // DomainError: button is only rendered for authorized users; safe to ignore
    }
  }

  function handleFormChange(field: keyof SetlistFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto grid gap-4">
        {/* Header */}
        <header className="glass-card p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Music size={22} style={{ color: "var(--color-primary)" }} />
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-weight-extrabold)",
                }}
              >
                Setlist
              </h1>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Biblioteca global de músicas
              </p>
            </div>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={openAdd}
              aria-label="Adicionar música"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-transform active:scale-95"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-neutral-50)",
                minHeight: "40px",
              }}
            >
              <Plus size={16} />
              Adicionar
            </button>
          )}
        </header>

        {/* Search */}
        <div className="glass-card p-3">
          <input
            type="search"
            placeholder="Buscar por título ou autor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Buscar por título ou autor"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p
            className="text-center py-8 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Nenhuma música encontrada.
          </p>
        ) : (
          <ul className="grid gap-3" role="list">
            {filtered.map((item) => (
              <li key={item.id} className="glass-card p-4 grid gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid gap-0.5 min-w-0">
                    <span
                      className="font-semibold truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {item.author}
                      {item.key && (
                        <span
                          className="ml-2 font-mono text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "var(--color-surface)" }}
                        >
                          {item.key}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${item.title} no YouTube`}
                      className="p-1.5 rounded-full transition-opacity hover:opacity-70"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <ExternalLink size={16} />
                    </a>
                    {canEdit && (
                      <>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          aria-label={`Editar ${item.title}`}
                          className="p-1.5 rounded-full transition-opacity hover:opacity-70"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remover ${item.title}`}
                          className="p-1.5 rounded-full transition-opacity hover:opacity-70 text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Inline Form Modal */}
        {showForm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingId ? "Editar música" : "Adicionar música"}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="glass-card w-full max-w-md p-5 grid gap-4">
              <div className="flex items-center justify-between">
                <h2
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {editingId ? "Editar música" : "Nova música"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Fechar formulário"
                  className="p-1 rounded-full hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-3">
                <FormField
                  label="Título *"
                  id="title"
                  value={form.title}
                  error={errors.title}
                  onChange={(v) => handleFormChange("title", v)}
                />
                <FormField
                  label="Autor *"
                  id="author"
                  value={form.author}
                  error={errors.author}
                  onChange={(v) => handleFormChange("author", v)}
                />
                <FormField
                  label="Tom (opcional)"
                  id="key"
                  value={form.key}
                  onChange={(v) => handleFormChange("key", v)}
                />
                <FormField
                  label="Link do YouTube *"
                  id="youtubeUrl"
                  value={form.youtubeUrl}
                  error={errors.youtubeUrl}
                  placeholder="https://www.youtube.com/watch?v=..."
                  onChange={(v) => handleFormChange("youtubeUrl", v)}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
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
    </div>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function FormField({
  label,
  id,
  value,
  error,
  placeholder,
  onChange,
}: FormFieldProps) {
  return (
    <div className="grid gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
        style={{
          background: "var(--color-surface)",
          borderColor: error ? "rgb(239 68 68)" : "rgba(255,255,255,0.15)",
        }}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <span id={`${id}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default SetlistPage;
