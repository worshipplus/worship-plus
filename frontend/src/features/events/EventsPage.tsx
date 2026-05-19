import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  ChevronRight,
  CalendarDays,
  Plus,
  X,
} from "lucide-react";
import type { UserRole, EventStatus, Event } from "../../types/event";
import { mockEvents } from "../../mocks/eventMocks";
import { mockUsers } from "../../mocks/userMocks";

interface EventsPageProps {
  userRole?: UserRole;
  currentUserName?: string;
}

type FilterType = "all" | "upcoming";

const STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  locked: "Finalizado",
};

const STATUS_COLORS: Record<EventStatus, string> = {
  draft: "rgba(234,179,8,0.15)",
  scheduled: "rgba(34,197,94,0.15)",
  locked: "rgba(99,102,241,0.15)",
};

const STATUS_TEXT_COLORS: Record<EventStatus, string> = {
  draft: "rgb(202,138,4)",
  scheduled: "rgb(22,163,74)",
  locked: "rgb(79,70,229)",
};
const DEFAULT_USER_NAME = "Ana Lima";

function generateEventId(): string {
  const randomUUID = globalThis.crypto?.randomUUID?.();
  return randomUUID ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventsPage({
  userRole = "team-member",
  currentUserName = DEFAULT_USER_NAME,
}: EventsPageProps) {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    owner: currentUserName,
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const canCreateEvent = userRole === "admin" || userRole === "ministro";
  const canChangeOwner = userRole === "admin";
  const ownerOptions = mockUsers.map((user) => user.name);

  const now = new Date();
  const filtered = events.filter((event) => {
    const isDraftHiddenForCurrentUser =
      userRole === "team-member" &&
      event.status === "draft" &&
      event.owner !== currentUserName;
    if (isDraftHiddenForCurrentUser) return false;
    if (filter === "upcoming") {
      return new Date(event.date) >= now;
    }
    return true;
  });

  function openCreateModal() {
    setFormData({
      title: "",
      date: "",
      description: "",
      owner: currentUserName,
    });
    setErrors({});
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    setShowCreateModal(false);
    setErrors({});
  }

  function validate() {
    const nextErrors: Partial<typeof formData> = {};
    if (!formData.title.trim()) nextErrors.title = "Título é obrigatório.";
    if (!formData.date.trim()) {
      nextErrors.date = "Data e hora são obrigatórias.";
    } else if (Number.isNaN(new Date(formData.date).getTime())) {
      nextErrors.date = "Data e hora inválidas.";
    }
    if (!formData.description.trim())
      nextErrors.description = "Descrição é obrigatória.";
    if (!formData.owner.trim()) nextErrors.owner = "Owner é obrigatório.";
    return nextErrors;
  }

  function handleCreateEvent() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newEvent: Event = {
      id: generateEventId(),
      title: formData.title.trim(),
      date: new Date(formData.date).toISOString(),
      description: formData.description.trim(),
      owner: formData.owner.trim(),
      status: "draft",
      eventSetlist: [],
    };

    setEvents((prev) => [newEvent, ...prev]);
    closeCreateModal();
  }

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto grid gap-4">
        {/* Header */}
        <header className="glass-card p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <CalendarDays size={22} style={{ color: "var(--color-primary)" }} />
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-weight-extrabold)",
                }}
              >
                Eventos
              </h1>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Agenda de eventos da igreja
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={!canCreateEvent}
            title={
              canCreateEvent
                ? "Criar Event"
                : "Somente Admin e Ministro podem criar Event."
            }
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-neutral-50)",
            }}
          >
            <Plus size={16} />
            Criar Event
          </button>
        </header>

        {/* Filters */}
        <div
          className="glass-card p-1 flex gap-1"
          role="group"
          aria-label="Filtros de eventos"
        >
          {(["all", "upcoming"] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all"
              style={
                filter === f
                  ? {
                      background: "var(--color-primary)",
                      color: "var(--color-neutral-50)",
                    }
                  : { color: "var(--color-text-secondary)" }
              }
            >
              {f === "all" ? "Todos" : "Próximos"}
            </button>
          ))}
        </div>

        {/* Event List */}
        {filtered.length === 0 ? (
          <p
            className="text-center py-8 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Nenhum evento encontrado.
          </p>
        ) : (
          <ul className="grid gap-3" role="list">
            {filtered.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="glass-card p-4 w-full text-left grid gap-2 active:scale-[0.98] transition-transform"
                  aria-label={`Ver detalhes de ${event.title}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="font-semibold leading-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {event.title}
                    </span>
                    <ChevronRight
                      size={16}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span
                      className="flex items-center gap-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <Calendar size={13} />
                      {formatDate(event.date)}
                    </span>
                    <span
                      className="flex items-center gap-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <User size={13} />
                      {event.owner}
                    </span>
                  </div>

                  <span
                    className="self-start text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: STATUS_COLORS[event.status],
                      color: STATUS_TEXT_COLORS[event.status],
                    }}
                  >
                    {STATUS_LABELS[event.status]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {showCreateModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Criar Event"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="glass-card w-full max-w-md p-5 grid gap-4">
              <div className="flex items-center justify-between">
                <h2
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  Novo Event
                </h2>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  aria-label="Fechar formulário"
                  className="p-1 rounded-full hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <EventFormField
                id="event-title"
                label="Título *"
                value={formData.title}
                error={errors.title}
                onChange={(value) => handleChange("title", value)}
              />
              <EventFormField
                id="event-date"
                label="Data/Hora *"
                value={formData.date}
                error={errors.date}
                type="datetime-local"
                onChange={(value) => handleChange("date", value)}
              />
              <EventFormField
                id="event-description"
                label="Descrição *"
                value={formData.description}
                error={errors.description}
                onChange={(value) => handleChange("description", value)}
              />

              <div className="grid gap-1">
                <label
                  htmlFor="event-owner"
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Owner *
                </label>
                {canChangeOwner ? (
                  <select
                    id="event-owner"
                    value={formData.owner}
                    onChange={(e) => handleChange("owner", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: errors.owner
                        ? "rgb(239 68 68)"
                        : "rgba(255,255,255,0.15)",
                    }}
                    aria-describedby={
                      errors.owner ? "event-owner-error" : undefined
                    }
                    aria-invalid={!!errors.owner}
                  >
                    {ownerOptions.map((ownerName) => (
                      <option key={ownerName} value={ownerName}>
                        {ownerName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="event-owner"
                    type="text"
                    value={formData.owner}
                    disabled
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none border opacity-80"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "rgba(255,255,255,0.15)",
                    }}
                  />
                )}
                {errors.owner && (
                  <span id="event-owner-error" className="text-xs text-red-500">
                    {errors.owner}
                  </span>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-neutral-50)",
                  }}
                >
                  Criar Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface EventFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "datetime-local";
}

function EventFormField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: EventFormFieldProps) {
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
        type={type}
        value={value}
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

export default EventsPage;
