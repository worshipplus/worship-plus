import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  ChevronRight,
  CalendarDays,
  PlusCircle,
} from "lucide-react";
import type { UserRole, EventStatus } from "../../types/event";
import { useEvents } from "../../context/events";

interface EventsPageProps {
  userRole?: UserRole;
}

type FilterType = "all" | "upcoming";

const STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  locked: "Locked Event",
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

function canCreateEvent(role: UserRole): boolean {
  return role === "admin" || role === "ministro";
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

export function EventsPage({ userRole = "team-member" }: EventsPageProps) {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [filter, setFilter] = useState<FilterType>("all");
  const now = new Date();
  const canCreate = canCreateEvent(userRole);

  const filtered = events.filter((event) => {
    if (filter === "upcoming") {
      return new Date(event.date) >= now;
    }
    return true;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto grid gap-4">
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

          {canCreate ? (
            <button
              type="button"
              onClick={() => navigate("/events/new")}
              aria-label="Criar Event"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-transform active:scale-95"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-neutral-50)",
                minHeight: "40px",
              }}
            >
              <PlusCircle size={16} />
              Criar Event
            </button>
          ) : (
            <div className="grid gap-1 justify-items-end">
              <button
                type="button"
                disabled
                aria-label="Criar Event indisponível"
                className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm opacity-50 cursor-not-allowed"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                  minHeight: "40px",
                }}
              >
                <PlusCircle size={16} />
                Criar Event
              </button>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Apenas Admin e Ministro podem criar Event.
              </span>
            </div>
          )}
        </header>

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
      </div>
    </div>
  );
}

export default EventsPage;
