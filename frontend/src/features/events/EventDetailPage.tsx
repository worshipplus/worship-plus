import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Music,
  Plus,
  Search,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import type { EventStatus, UserRole } from "../../types/event";
import { useEvents } from "../../context/events";
import { mockSetlistItems } from "../../mocks/setlistMocks";

interface EventDetailPageProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
}

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

export function EventDetailPage({
  currentUserRole = "team-member",
  currentUserName = "",
}: EventDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    events,
    addSongToEventSetlist,
    removeEventSetlistItem,
    reorderEventSetlist,
  } = useEvents();

  const [showSetlistModal, setShowSetlistModal] = useState(false);
  const [search, setSearch] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const event = events.find((entry) => entry.id === id);

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

  const canEditSetlist =
    currentUserRole === "admin" || currentUserName === event.owner;
  const eventId = event.id;

  const availableSetlistItems = mockSetlistItems.filter(
    (song) =>
      (song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.author.toLowerCase().includes(search.toLowerCase())) &&
      !event.eventSetlist.some((item) => item.title === song.title),
  );

  function handleDrop(toIndex: number) {
    if (!canEditSetlist || draggedIndex === null) return;
    reorderEventSetlist(eventId, draggedIndex, toIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto grid gap-4">
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

        <section aria-labelledby="event-setlist-heading">
          <div className="glass-card p-4 grid gap-3">
            <div className="flex items-center gap-2 flex-wrap">
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
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {event.eventSetlist.length}{" "}
                {event.eventSetlist.length === 1 ? "música" : "músicas"}
              </span>

              {canEditSetlist ? (
                <button
                  type="button"
                  onClick={() => setShowSetlistModal(true)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-neutral-50)",
                  }}
                >
                  <Plus size={14} />
                  Adicionar do Setlist
                </button>
              ) : (
                <p
                  className="ml-auto text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Apenas Admin ou Owner podem editar o Event Setlist.
                </p>
              )}
            </div>

            {event.eventSetlist.length === 0 ? (
              <p
                className="text-center py-4 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Nenhuma música no Event Setlist ainda.
              </p>
            ) : (
              <ul
                className="grid gap-2"
                role="list"
                aria-label="Itens do Event Setlist"
              >
                {event.eventSetlist.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: "var(--color-surface)",
                      outline:
                        dragOverIndex === index
                          ? "2px dashed var(--color-primary)"
                          : "none",
                    }}
                    draggable={canEditSetlist}
                    onDragStart={() => setDraggedIndex(index)}
                    onDragOver={(e) => {
                      if (!canEditSetlist) return;
                      e.preventDefault();
                      setDragOverIndex(index);
                    }}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDragOverIndex(null);
                    }}
                  >
                    <span
                      className="text-xs font-mono w-5 text-center shrink-0"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {index + 1}
                    </span>

                    {canEditSetlist && (
                      <GripVertical
                        size={14}
                        className="shrink-0"
                        style={{ color: "var(--color-text-secondary)" }}
                        aria-label="Reordenar item"
                      />
                    )}

                    <div className="min-w-0 flex-1 grid gap-0.5">
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ fontFamily: "var(--font-display)" }}
                        data-testid="event-setlist-title"
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
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline break-all"
                        style={{ color: "var(--color-primary)" }}
                      >
                        YouTube Link
                      </a>
                    </div>

                    {canEditSetlist && (
                      <button
                        type="button"
                        onClick={() =>
                          removeEventSetlistItem(event.id, item.id)
                        }
                        className="p-1.5 rounded-full transition-opacity hover:opacity-70 text-red-500"
                        aria-label={`Remover ${item.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {showSetlistModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Adicionar música do Setlist"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="glass-card w-full max-w-md p-5 grid gap-4">
              <div className="flex items-center justify-between gap-2">
                <h3
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  Buscar no Setlist
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowSetlistModal(false);
                    setSearch("");
                  }}
                  aria-label="Fechar modal"
                  className="p-1 rounded-full hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-2.5"
                  style={{ color: "var(--color-text-secondary)" }}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar música por título ou autor"
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none border"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "rgba(255,255,255,0.15)",
                    color: "var(--color-text-secondary)",
                  }}
                  aria-label="Buscar música no Setlist"
                />
              </div>

              {availableSetlistItems.length === 0 ? (
                <p
                  className="text-sm text-center"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Nenhuma música disponível para adicionar.
                </p>
              ) : (
                <ul className="grid gap-2 max-h-72 overflow-y-auto" role="list">
                  {availableSetlistItems.map((song) => (
                    <li
                      key={song.id}
                      className="p-3 rounded-xl grid gap-1"
                      style={{ background: "var(--color-surface)" }}
                    >
                      <span
                        className="font-semibold text-sm"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {song.title}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {song.author}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          addSongToEventSetlist(eventId, song);
                          setShowSetlistModal(false);
                          setSearch("");
                        }}
                        className="justify-self-start mt-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          background: "var(--color-primary)",
                          color: "var(--color-neutral-50)",
                        }}
                        aria-label={`Adicionar ${song.title}`}
                      >
                        Adicionar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailPage;
