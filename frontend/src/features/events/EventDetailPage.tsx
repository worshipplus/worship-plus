import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Music,
  ExternalLink,
} from "lucide-react";
import type { EventStatus } from "../../types/event";
import { mockEvents } from "../../mocks/eventMocks";

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

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center gap-4">
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
          role="alert"
        >
          Evento não encontrado.
        </p>
        <button
          type="button"
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--color-primary)" }}
        >
          <ArrowLeft size={16} />
          Voltar para Eventos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto grid gap-4">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/events")}
          className="self-start flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--color-primary)" }}
          aria-label="Voltar para lista de eventos"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Event header card */}
        <div className="glass-card p-5 grid gap-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-weight-extrabold)",
                lineHeight: 1.3,
              }}
            >
              {event.title}
            </h1>
            <span
              className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: STATUS_COLORS[event.status],
                color: STATUS_TEXT_COLORS[event.status],
              }}
            >
              {STATUS_LABELS[event.status]}
            </span>
          </div>

          <div className="grid gap-2 text-sm">
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Calendar size={15} style={{ color: "var(--color-primary)" }} />
              <span>{formatDateTime(event.date)}</span>
            </div>
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <User size={15} style={{ color: "var(--color-primary)" }} />
              <span>
                <span className="font-medium" style={{ color: "inherit" }}>
                  Owner:
                </span>{" "}
                {event.owner}
              </span>
            </div>
          </div>

          {event.description && (
            <div
              className="flex items-start gap-2 text-sm pt-1 border-t"
              style={{
                color: "var(--color-text-secondary)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <FileText
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-primary)" }}
              />
              <p>{event.description}</p>
            </div>
          )}
        </div>

        {/* Event Setlist */}
        <section aria-labelledby="event-setlist-heading">
          <div className="glass-card p-4 grid gap-3">
            <div className="flex items-center gap-2">
              <Music size={18} style={{ color: "var(--color-primary)" }} />
              <h2
                id="event-setlist-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "var(--text-base)",
                }}
              >
                Event Setlist
              </h2>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {event.eventSetlist.length}{" "}
                {event.eventSetlist.length === 1 ? "música" : "músicas"}
              </span>
            </div>

            {event.eventSetlist.length === 0 ? (
              <p
                className="text-center py-4 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Nenhuma música no setlist ainda.
              </p>
            ) : (
              <ul className="grid gap-2" role="list">
                {event.eventSetlist.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--color-surface)" }}
                  >
                    <span
                      className="text-xs font-mono w-5 text-center shrink-0"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1 grid gap-0.5">
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {item.author}
                        {item.key && (
                          <span
                            className="ml-2 font-mono px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                          >
                            {item.key}
                          </span>
                        )}
                      </span>
                    </div>
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${item.title} no YouTube`}
                      className="shrink-0 p-1.5 rounded-full transition-opacity hover:opacity-70"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <ExternalLink size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default EventDetailPage;
