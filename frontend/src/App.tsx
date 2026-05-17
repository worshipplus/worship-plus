import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import "./App.css";
import {
  canCreateEvent,
  canManageEventSetlist,
  createDefaultEventForm,
  formatEventDateTime,
  initialEvents,
  mockSongs,
  mockUsers,
  reorderSetlist,
  roleLabels,
} from "./domain";
import type { EventFormValues, EventRecord, Song } from "./domain";

interface FormErrors {
  title?: string;
  scheduledAt?: string;
  description?: string;
  ownerId?: string;
}

const FOCUSABLE_ELEMENT_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [role="button"], audio[controls], video[controls], details, summary, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

const songsById = new Map(mockSongs.map((song) => [song.id, song]));

function App() {
  const eventCounterRef = useRef(initialEvents.length + 1);
  const setlistCounterRef = useRef(100);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const songSearchInputRef = useRef<HTMLInputElement | null>(null);
  const modalTriggerRef = useRef<HTMLElement | null>(null);

  const [currentUserId, setCurrentUserId] = useState(mockUsers[0].id);
  const [events, setEvents] = useState<EventRecord[]>(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState(
    initialEvents[0]?.id ?? "",
  );
  const [formValues, setFormValues] = useState<EventFormValues>(() =>
    createDefaultEventForm(mockUsers[0].id),
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitFeedback, setSubmitFeedback] = useState<string>("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [songSearch, setSongSearch] = useState("");
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetItemId, setDropTargetItemId] = useState<string | null>(null);

  const currentUser =
    mockUsers.find((user) => user.id === currentUserId) ?? mockUsers[0];
  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? null;
  const canCreate = canCreateEvent(currentUser.role);
  const canEditSelectedEventSetlist = selectedEvent
    ? canManageEventSetlist(currentUser, selectedEvent)
    : false;

  useEffect(() => {
    setFormValues(createDefaultEventForm(currentUser.id));
    setFormErrors({});
    setSubmitFeedback("");
  }, [currentUser.id]);

  useEffect(() => {
    if (!searchModalOpen) {
      return;
    }

    songSearchInputRef.current?.focus();
  }, [searchModalOpen]);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = songSearch.trim().toLowerCase();

    return mockSongs.filter((song) => {
      if (!normalizedQuery) {
        return true;
      }

      return [song.title, song.artist, song.notes]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [songSearch]);

  const selectedEventSongs = useMemo(() => {
    if (!selectedEvent) {
      return [];
    }

    return selectedEvent.setlist
      .map((item) => {
        const song = songsById.get(item.songId);
        if (!song) {
          return null;
        }

        return {
          ...item,
          song,
        };
      })
      .filter(
        (item): item is { id: string; songId: string; song: Song } =>
          item !== null,
      );
  }, [selectedEvent]);

  const selectedSongIds = useMemo(
    () => new Set(selectedEvent?.setlist.map((item) => item.songId) ?? []),
    [selectedEvent],
  );

  const handleFormChange = (field: keyof EventFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setSubmitFeedback("");
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formValues.title.trim()) {
      nextErrors.title = "Informe o título do evento.";
    }

    if (!formValues.scheduledAt) {
      nextErrors.scheduledAt = "Informe a data e hora do evento.";
    }

    if (!formValues.description.trim()) {
      nextErrors.description = "Informe a descrição do evento.";
    }

    if (currentUser.role === "admin" && !formValues.ownerId) {
      nextErrors.ownerId = "Selecione um owner para o evento.";
    }

    return nextErrors;
  };

  const handleCreateEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canCreate) {
      setSubmitFeedback("Seu perfil não pode criar eventos no MVP.");
      return;
    }

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      setSubmitFeedback("Revise os campos obrigatórios para continuar.");
      return;
    }

    const ownerId =
      currentUser.role === "admin" ? formValues.ownerId : currentUser.id;
    const ownerUser = mockUsers.find((user) => user.id === ownerId);
    const ownerName = ownerUser?.name ?? "owner não identificado";
    const newEventId = `event-${eventCounterRef.current}`;
    eventCounterRef.current += 1;

    const newEvent: EventRecord = {
      id: newEventId,
      title: formValues.title.trim(),
      scheduledAt: formValues.scheduledAt,
      description: formValues.description.trim(),
      status: "draft",
      ownerId,
      createdById: currentUser.id,
      setlist: [],
    };

    setEvents((currentEvents) => [newEvent, ...currentEvents]);
    setSelectedEventId(newEvent.id);
    setFormValues(createDefaultEventForm(currentUser.id));
    setFormErrors({});
    setSubmitFeedback(
      ownerId === currentUser.id
        ? `Evento criado em rascunho com owner definido automaticamente como ${ownerName}.`
        : `Evento criado em rascunho com owner definido por Admin como ${ownerName}.`,
    );
  };

  const handleAddSong = (songId: string) => {
    if (
      !selectedEvent ||
      !canEditSelectedEventSetlist ||
      selectedSongIds.has(songId)
    ) {
      return;
    }

    const nextSetlistId = `event-song-${setlistCounterRef.current}`;
    setlistCounterRef.current += 1;

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              setlist: [...event.setlist, { id: nextSetlistId, songId }],
            }
          : event,
      ),
    );
    closeSearchModal();
  };

  const handleRemoveSong = (itemId: string) => {
    if (!selectedEvent || !canEditSelectedEventSetlist) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              setlist: event.setlist.filter((item) => item.id !== itemId),
            }
          : event,
      ),
    );
  };

  const moveSong = (itemId: string, direction: -1 | 1) => {
    if (!selectedEvent || !canEditSelectedEventSetlist) {
      return;
    }

    const currentIndex = selectedEvent.setlist.findIndex(
      (item) => item.id === itemId,
    );
    const nextIndex = currentIndex + direction;

    if (
      currentIndex === -1 ||
      nextIndex < 0 ||
      nextIndex >= selectedEvent.setlist.length
    ) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              setlist: reorderSetlist(event.setlist, currentIndex, nextIndex),
            }
          : event,
      ),
    );
  };

  const handleDropOnItem = (targetItemId: string) => {
    if (!selectedEvent || !canEditSelectedEventSetlist || !draggedItemId) {
      return;
    }

    const fromIndex = selectedEvent.setlist.findIndex(
      (item) => item.id === draggedItemId,
    );
    const toIndex = selectedEvent.setlist.findIndex(
      (item) => item.id === targetItemId,
    );

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedItemId(null);
      setDropTargetItemId(null);
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              setlist: reorderSetlist(event.setlist, fromIndex, toIndex),
            }
          : event,
      ),
    );
    setDraggedItemId(null);
    setDropTargetItemId(null);
  };

  const openSearchModal = () => {
    modalTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSearchModalOpen(true);
  };

  const closeSearchModal = useCallback(() => {
    setSearchModalOpen(false);
    setSongSearch("");
    modalTriggerRef.current?.focus();
  }, []);

  const trapSearchModalFocus = useCallback(
    (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();
        closeSearchModal();
        return;
      }

      if (keyboardEvent.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          FOCUSABLE_ELEMENT_SELECTOR,
        ) ?? [],
      ).filter((element) => element.tabIndex >= 0);

      if (focusableElements.length === 0) {
        keyboardEvent.preventDefault();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const isFocusInsideModal =
        modalRef.current?.contains(activeElement) ?? false;

      if (keyboardEvent.shiftKey) {
        if (!isFocusInsideModal || activeElement === firstFocusable) {
          keyboardEvent.preventDefault();
          lastFocusable.focus();
        }
        return;
      }

      if (!isFocusInsideModal || activeElement === lastFocusable) {
        keyboardEvent.preventDefault();
        firstFocusable.focus();
      }
    },
    [closeSearchModal],
  );

  useEffect(() => {
    if (!searchModalOpen) {
      return;
    }

    const handleDocumentKeyDown = (keyboardEvent: KeyboardEvent) => {
      trapSearchModalFocus(keyboardEvent);
    };

    document.addEventListener("keydown", handleDocumentKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown, true);
    };
  }, [searchModalOpen, trapSearchModalFocus]);

  const ownerName = selectedEvent
    ? (mockUsers.find((user) => user.id === selectedEvent.ownerId)?.name ??
      "Owner não encontrado")
    : "Nenhum evento selecionado";

  return (
    <main className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">PRD-005 · MVP</p>
          <h1>Criação de Evento e gestão do Event Setlist</h1>
          <p className="hero-copy">
            Fluxo com dados mockados para criar eventos em rascunho, ajustar
            owner e montar a ordem das músicas com referência do YouTube.
          </p>
        </div>

        <div className="session-card" aria-label="Contexto de autenticação">
          <label className="field-label" htmlFor="current-user">
            Usuário atual
          </label>
          <select
            id="current-user"
            className="select-input"
            value={currentUser.id}
            onChange={(changeEvent) =>
              setCurrentUserId(changeEvent.target.value)
            }
          >
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {roleLabels[user.role]}
              </option>
            ))}
          </select>
          <p className="session-note">
            Perfil ativo: <strong>{roleLabels[currentUser.role]}</strong>
          </p>
        </div>
      </header>

      <section className="content-grid">
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">US-007</p>
              <h2>Criar Event</h2>
            </div>
            <span
              className="ghost-button"
              aria-label={
                canCreate
                  ? "Nova criação liberada"
                  : "Nova criação não liberada"
              }
            >
              Nova criação liberada
            </span>
          </div>

          {!canCreate ? (
            <div className="permission-banner" role="status">
              Team Member não pode criar Event. O botão fica desabilitado e o
              acesso é bloqueado no formulário.
            </div>
          ) : null}

          <form className="event-form" onSubmit={handleCreateEvent} noValidate>
            <label className="field-group" htmlFor="event-title">
              <span className="field-label">Título</span>
              <input
                id="event-title"
                className="text-input"
                type="text"
                placeholder="Ex.: Culto de Celebração"
                value={formValues.title}
                onChange={(changeEvent) =>
                  handleFormChange("title", changeEvent.target.value)
                }
                disabled={!canCreate}
              />
              {formErrors.title ? (
                <span className="field-error">{formErrors.title}</span>
              ) : null}
            </label>

            <label className="field-group" htmlFor="event-date">
              <span className="field-label">Data e hora</span>
              <input
                id="event-date"
                className="text-input"
                type="datetime-local"
                value={formValues.scheduledAt}
                onChange={(changeEvent) =>
                  handleFormChange("scheduledAt", changeEvent.target.value)
                }
                disabled={!canCreate}
              />
              {formErrors.scheduledAt ? (
                <span className="field-error">{formErrors.scheduledAt}</span>
              ) : null}
            </label>

            <label className="field-group" htmlFor="event-description">
              <span className="field-label">Descrição</span>
              <textarea
                id="event-description"
                className="textarea-input"
                placeholder="Contexto do culto, observações e direcionamento do ensaio"
                value={formValues.description}
                onChange={(changeEvent) =>
                  handleFormChange("description", changeEvent.target.value)
                }
                disabled={!canCreate}
                rows={4}
              />
              {formErrors.description ? (
                <span className="field-error">{formErrors.description}</span>
              ) : null}
            </label>

            {currentUser.role === "admin" ? (
              <label className="field-group" htmlFor="event-owner">
                <span className="field-label">Owner</span>
                <select
                  id="event-owner"
                  className="select-input"
                  value={formValues.ownerId}
                  onChange={(changeEvent) =>
                    handleFormChange("ownerId", changeEvent.target.value)
                  }
                >
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <span className="field-help">
                  Admin pode alterar o owner na criação. O valor padrão é o
                  criador atual.
                </span>
                {formErrors.ownerId ? (
                  <span className="field-error">{formErrors.ownerId}</span>
                ) : null}
              </label>
            ) : (
              <div className="field-group">
                <span className="field-label">Owner</span>
                <div className="readonly-field">{currentUser.name}</div>
                <span className="field-help">
                  Owner definido automaticamente como o usuário criador.
                </span>
              </div>
            )}

            <div className="status-row">
              <div>
                <span className="field-label">Status inicial</span>
                <p className="status-chip draft">Rascunho</p>
              </div>
              <button
                className="primary-button"
                type="submit"
                disabled={!canCreate}
              >
                Criar evento
              </button>
            </div>

            {submitFeedback ? (
              <p className="submit-feedback" role="status">
                {submitFeedback}
              </p>
            ) : null}
          </form>
        </article>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Eventos mockados</p>
              <h2>Eventos em rascunho</h2>
            </div>
            <span className="event-count">{events.length} eventos</span>
          </div>

          <div className="event-list" role="list" aria-label="Lista de eventos">
            {events.map((event) => {
              const eventOwner = mockUsers.find(
                (user) => user.id === event.ownerId,
              );
              const isSelected = event.id === selectedEventId;

              return (
                <button
                  key={event.id}
                  className={`event-card ${isSelected ? "selected" : ""}`}
                  type="button"
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <span className="status-chip draft">
                    {event.status === "draft" ? "Rascunho" : event.status}
                  </span>
                  <strong>{event.title}</strong>
                  <span>{formatEventDateTime(event.scheduledAt)}</span>
                  <span>Owner: {eventOwner?.name ?? "Não definido"}</span>
                  <span>{event.setlist.length} músicas no Event Setlist</span>
                </button>
              );
            })}
          </div>
        </article>
      </section>

      {selectedEvent ? (
        <section className="panel-card event-detail-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">US-008</p>
              <h2>{selectedEvent.title}</h2>
            </div>
            <div className="event-meta-inline">
              <span className="status-chip draft">Rascunho</span>
              <span>{formatEventDateTime(selectedEvent.scheduledAt)}</span>
            </div>
          </div>

          <div className="event-summary-grid">
            <div>
              <span className="field-label">Descrição</span>
              <p>{selectedEvent.description}</p>
            </div>
            <div>
              <span className="field-label">Owner</span>
              <p>{ownerName}</p>
            </div>
            <div>
              <span className="field-label">Criado por</span>
              <p>
                {mockUsers.find((user) => user.id === selectedEvent.createdById)
                  ?.name ?? "Usuário desconhecido"}
              </p>
            </div>
          </div>

          <div className="setlist-header">
            <div>
              <span className="field-label">Event Setlist</span>
              <p className="setlist-copy">
                Apenas Admin ou owner do Event podem editar esta lista. O
                conteúdo é mockado e exibe o link do YouTube para ensaio.
              </p>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={openSearchModal}
              disabled={!canEditSelectedEventSetlist}
            >
              Adicionar música
            </button>
          </div>

          {!canEditSelectedEventSetlist ? (
            <div className="permission-banner" role="status">
              Você pode visualizar o Event Setlist, mas não editar porque não é
              Admin nem owner do evento selecionado.
            </div>
          ) : null}

          {selectedEventSongs.length > 0 ? (
            <ol className="setlist-list" aria-label="Event Setlist">
              {selectedEventSongs.map((item, index) => {
                const isDragging = draggedItemId === item.id;
                const isDropTarget =
                  dropTargetItemId === item.id && draggedItemId !== item.id;

                return (
                  <li
                    key={item.id}
                    className={`setlist-item ${isDragging ? "dragging" : ""} ${isDropTarget ? "drop-target" : ""}`}
                    draggable={canEditSelectedEventSetlist}
                    onDragStart={() => setDraggedItemId(item.id)}
                    onDragEnd={() => {
                      setDraggedItemId(null);
                      setDropTargetItemId(null);
                    }}
                    onDragEnter={() => {
                      if (canEditSelectedEventSetlist) {
                        setDropTargetItemId(item.id);
                      }
                    }}
                    onDragOver={(dragEvent) => {
                      if (canEditSelectedEventSetlist) {
                        dragEvent.preventDefault();
                      }
                    }}
                    onDrop={(dragEvent) => {
                      dragEvent.preventDefault();
                      handleDropOnItem(item.id);
                    }}
                    data-testid={`setlist-item-${item.id}`}
                  >
                    <div className="song-order">{index + 1}</div>
                    <div className="song-content">
                      <div className="song-heading-row">
                        <h3>{item.song.title}</h3>
                        <span>{item.song.artist}</span>
                      </div>
                      <p>{item.song.notes}</p>
                      <a
                        href={item.song.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        YouTube Link
                      </a>
                    </div>
                    {canEditSelectedEventSetlist ? (
                      <div className="song-actions">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => moveSong(item.id, -1)}
                          disabled={index === 0}
                          aria-label={`Mover ${item.song.title} para cima`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => moveSong(item.id, 1)}
                          disabled={index === selectedEventSongs.length - 1}
                          aria-label={`Mover ${item.song.title} para baixo`}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleRemoveSong(item.id)}
                          aria-label={`Remover ${item.song.title}`}
                        >
                          Remover
                        </button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="empty-state">
              Nenhuma música adicionada ainda. Use o modal para buscar no
              Setlist global.
            </div>
          )}
        </section>
      ) : null}

      {searchModalOpen && selectedEvent ? (
        <div className="modal-backdrop" role="presentation">
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="song-modal-title"
            ref={modalRef}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Setlist global</p>
                <h2 id="song-modal-title">Buscar músicas</h2>
              </div>
              <button
                className="ghost-button"
                type="button"
                onClick={closeSearchModal}
              >
                Fechar
              </button>
            </div>

            <label className="field-group" htmlFor="song-search">
              <span className="field-label">Buscar no Setlist</span>
              <input
                id="song-search"
                className="text-input"
                type="search"
                ref={songSearchInputRef}
                value={songSearch}
                onChange={(changeEvent) =>
                  setSongSearch(changeEvent.target.value)
                }
                placeholder="Digite título, artista ou contexto"
              />
            </label>

            <div
              className="song-search-list"
              role="list"
              aria-label="Resultados do setlist"
            >
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => {
                  const isAlreadyAdded = selectedSongIds.has(song.id);

                  return (
                    <div
                      className="song-search-card"
                      role="listitem"
                      key={song.id}
                    >
                      <div>
                        <strong>{song.title}</strong>
                        <p>
                          {song.artist} · {song.notes}
                        </p>
                        <a
                          href={song.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          YouTube Link
                        </a>
                      </div>
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => handleAddSong(song.id)}
                        disabled={
                          isAlreadyAdded || !canEditSelectedEventSetlist
                        }
                      >
                        {isAlreadyAdded ? "Já adicionada" : "Adicionar"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  Nenhuma música encontrada para a busca informada.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
