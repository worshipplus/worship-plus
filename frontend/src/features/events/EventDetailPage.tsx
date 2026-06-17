import { useState, useEffect, useMemo } from "react";
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
import type { Event, EventStatus, UserRole } from "../../types/event";
import { useGetEventsByOwner } from "../../hooks/useGetEventsByOwner";
import { useSearchSetlist } from "../../hooks/useSearchSetlist";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";
import { ScaleSection } from "./ScaleSection";
import { useEventSetlistMutations } from "../../hooks/useEventSetlistMutations";
import { useScaleMutations } from "../../hooks/useScaleMutations";
import { canViewEvent, canEditEventSetlist, canEditScale } from "./permissions";

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

interface EventDetailPageProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
  currentUserId?: string;
}

export function EventDetailPage({
  currentUserRole = "team-member",
  currentUserName = "",
  currentUserId = "",
}: EventDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: allEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useGetEventsByOwner();
  const { data: allUsers } = useGetAllUsers();
  const { addSong, removeSong } = useEventSetlistMutations(
    currentUserRole,
    currentUserName,
  );
  const { addToScale, removeFromScale, updateScaleRole } = useScaleMutations(
    currentUserRole,
    currentUserId,
    allUsers,
  );
  const [search, setSearch] = useState("");
  const { data: filteredSetlist } = useSearchSetlist(search);

  const baseEvent = useMemo(
    () => allEvents.find((item) => item.id === id),
    [allEvents, id],
  );
  const [event, setEvent] = useState<Event | undefined>(baseEvent);
  const [showSongModal, setShowSongModal] = useState(false);
  const [songModalError, setSongModalError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setEvent(baseEvent);
  }, [baseEvent]);

  if (!eventsLoading && eventsError) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-red-500" role="alert">
          Erro ao carregar evento. Tente novamente.
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

  if (!eventsLoading && !eventsError && !event) {
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

  if (!event) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center gap-4">
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Carregando evento...
        </p>
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
          Você não tem permissão para visualizar este evento em rascunho.
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

  const canEditSetlist = canEditEventSetlist(
    event,
    currentUserRole,
    currentUserName,
  );

  const canEditScaleSection = canEditScale(
    event,
    currentUserRole,
    currentUserId,
  );

  const usersNotInScale = allUsers.filter(
    (user) => !event.scale.some((entry) => entry.userId === user.id),
  );

  function handleAddSong(songId: string) {
    if (!event) return;
    const selectedSong = filteredSetlist.find((song) => song.id === songId);
    if (!selectedSong) return;
    const result = addSong(event, selectedSong);
    if (!result.ok) {
      setSongModalError(result.message);
      return;
    }
    setEvent((prev) =>
      prev
        ? { ...prev, eventSetlist: [...prev.eventSetlist, result.item] }
        : prev,
    );
    setSongModalError(null);
  }

  function handleRemoveSong(songId: string) {
    const result = removeSong(event, songId);
    if (!result.ok) return;
    setEvent((prev) =>
      prev ? { ...prev, eventSetlist: result.updatedSetlist } : prev,
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

  function handleAddToScale(
    userId: string,
    userName: string,
    papel: string,
  ): string | null {
    const result = addToScale(event, userId, userName, papel);
    if (!result.ok) return result.message;
    setEvent((prev) =>
      prev ? { ...prev, scale: [...prev.scale, result.entry] } : prev,
    );
    return null;
  }

  function handleRemoveFromScale(entryId: string) {
    const result = removeFromScale(event, entryId);
    if (!result.ok) return;
    setEvent((prev) => (prev ? { ...prev, scale: result.updatedScale } : prev));
  }

  function handleEditPapel(entryId: string, papel: string): string | null {
    if (!event) return null;
    const member = event.scale.find((entry) => entry.id === entryId);
    if (!member) return "Integrante não encontrado na Escala.";

    const result = updateScaleRole(event, member.userId, papel);
    if (!result.ok) return result.message;

    setEvent((prev) =>
      prev
        ? {
            ...prev,
            scale: prev.scale.map((entry) =>
              entry.id === entryId ? result.entry : entry,
            ),
          }
        : prev,
    );
    return null;
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
              {canEditSetlist && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSongModal(true);
                    setSongModalError(null);
                  }}
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
                    draggable={canEditSetlist}
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
                    {canEditSetlist && (
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
                      {canEditSetlist && (
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

        <ScaleSection
          scale={event.scale}
          canEdit={canEditScaleSection}
          allUsers={allUsers}
          availableUsers={usersNotInScale}
          onAdd={handleAddToScale}
          onRemove={handleRemoveFromScale}
          onEditPapel={handleEditPapel}
        />
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
                onClick={() => {
                  setShowSongModal(false);
                  setSongModalError(null);
                }}
                aria-label="Fechar busca"
                className="p-1 rounded-full hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <X size={18} />
              </button>
            </div>
            {songModalError && (
              <p className="text-xs text-red-500" role="alert">
                {songModalError}
              </p>
            )}
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
                const alreadyAdded = event.eventSetlist.some(
                  (item) =>
                    item.title === song.title &&
                    item.author === song.author &&
                    item.youtubeUrl === song.youtubeUrl,
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
