import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Music,
  ExternalLink,
  Plus,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import type {
  EventStatus,
  UserRole,
  EventSetlistItem,
} from "../../types/event";
import { mockEvents } from "../../mocks/eventMocks";
import { mockSetlistItems } from "../../mocks/setlistMocks";
import { canViewEvent } from "./permissions";

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

function isSongInEventSetlist(
  eventSetlist: EventSetlistItem[],
  song: EventSetlistItem,
): boolean {
  return eventSetlist.some(
    (item) =>
      item.title === song.title &&
      item.author === song.author &&
      item.youtubeUrl === song.youtubeUrl,
  );
}

function generateItemId(songId: string): string {
  const randomUUID = globalThis.crypto?.randomUUID?.();
  return randomUUID ? `${songId}-${randomUUID}` : `${songId}-${Date.now()}`;
}

interface EventDetailPageProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
}

export function EventDetailPage({
  currentUserRole = "team-member",
  currentUserName = "",
}: EventDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState(mockEvents.find((item) => item.id === id));
  const [search, setSearch] = useState("");
  const [showSongModal, setShowSongModal] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const hasEventVisibility = canViewEvent(
    event,
    currentUserRole,
    currentUserName,
  );

  if (!hasEventVisibility) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center gap-4">
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
          role="alert"
        >
          Você não tem permissão para visualizar este Event em rascunho.
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

  const canEditEventSetlist =
    currentUserRole === "admin" || event.owner === currentUserName;

  const filteredSetlist = mockSetlistItems.filter((song) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      song.title.toLowerCase().includes(query) ||
      song.author.toLowerCase().includes(query)
    );
  });

  function handleAddSong(songId: string) {
    if (!event) return;
    const selectedSong = mockSetlistItems.find((song) => song.id === songId);
    if (!selectedSong) return;
    const alreadyAdded = isSongInEventSetlist(event.eventSetlist, selectedSong);
    if (alreadyAdded) return;

    const newSong: EventSetlistItem = {
      id: generateItemId(songId),
      title: selectedSong.title,
      author: selectedSong.author,
      key: selectedSong.key,
      youtubeUrl: selectedSong.youtubeUrl,
    };

    setEvent((prev) =>
      prev
        ? {
            ...prev,
            eventSetlist: [...prev.eventSetlist, newSong],
          }
        : prev,
    );
  }

  function handleRemoveSong(songId: string) {
    setEvent((prev) =>
      prev
        ? {
            ...prev,
            eventSetlist: prev.eventSetlist.filter(
              (item) => item.id !== songId,
            ),
          }
        : prev,
    );
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    setEvent((prev) => {
      if (!prev) return prev;
      const reordered = [...prev.eventSetlist];
      const [dragged] = reordered.splice(dragIndex, 1);
      reordered.splice(dropIndex, 0, dragged);
      return { ...prev, eventSetlist: reordered };
    });
    setDragIndex(null);
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
              {canEditEventSetlist && (
                <button
                  type="button"
                  onClick={() => setShowSongModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-neutral-50)",
                  }}
                >
                  <Plus size={13} />
                  Adicionar música
                </button>
              )}
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
                    draggable={canEditEventSetlist}
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(dragEvent) => {
                      dragEvent.preventDefault();
                      setDragOverIndex(index);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: "var(--color-surface)",
                      outline:
                        dragOverIndex === index
                          ? "2px solid var(--color-primary)"
                          : undefined,
                    }}
                  >
                    {canEditEventSetlist && (
                      <GripVertical
                        size={14}
                        className="shrink-0 cursor-grab"
                        style={{ color: "var(--color-text-secondary)" }}
                        aria-hidden="true"
                      />
                    )}
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
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Link do YouTube para ${item.title}`}
                        className="text-xs hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Ver no YouTube
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir ${item.title} no YouTube`}
                        className="p-1.5 rounded-full transition-opacity hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                      >
                        <ExternalLink size={15} />
                      </a>
                      {canEditEventSetlist && (
                        <button
                          type="button"
                          aria-label={`Remover ${item.title}`}
                          onClick={() => handleRemoveSong(item.id)}
                          className="p-1.5 rounded-full transition-opacity hover:opacity-70 text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {showSongModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Buscar músicas do Setlist"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="glass-card w-full max-w-xl p-5 grid gap-4 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                Buscar no Setlist
              </h3>
              <button
                type="button"
                onClick={() => setShowSongModal(false)}
                aria-label="Fechar busca"
                className="p-1 rounded-full hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <X size={18} />
              </button>
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou autor..."
              aria-label="Buscar músicas no Setlist"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
              style={{
                background: "var(--color-surface)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            />
            <ul className="grid gap-2 overflow-y-auto" role="list">
              {filteredSetlist.map((song) => {
                const alreadyAdded = isSongInEventSetlist(
                  event.eventSetlist,
                  song,
                );
                return (
                  <li
                    key={song.id}
                    className="p-3 rounded-lg flex items-start justify-between gap-3"
                    style={{ background: "var(--color-surface)" }}
                  >
                    <div className="min-w-0 grid">
                      <span className="text-sm font-semibold truncate">
                        {song.title}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {song.author}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSong(song.id)}
                      disabled={alreadyAdded}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-40"
                      style={{
                        background: "var(--color-primary)",
                        color: "var(--color-neutral-50)",
                      }}
                    >
                      {alreadyAdded ? "Adicionada" : "Adicionar"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;
