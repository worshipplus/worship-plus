import { useState } from "react";
import { ArrowLeft, CalendarDays, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../../mocks/userMocks";
import { useEvents } from "../../context/events";
import type { UserRole } from "../../types/shared";

interface EventCreatePageProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
}

interface EventFormData {
  title: string;
  date: string;
  description: string;
  owner: string;
}

interface EventFormErrors {
  title?: string;
  date?: string;
  description?: string;
  owner?: string;
}

function canCreateEvent(role: UserRole): boolean {
  return role === "admin" || role === "ministro";
}

function validateForm(data: EventFormData): EventFormErrors {
  const errors: EventFormErrors = {};

  if (!data.title.trim()) errors.title = "Título é obrigatório.";
  if (!data.date.trim()) errors.date = "Data e hora são obrigatórias.";
  if (!data.description.trim()) errors.description = "Descrição é obrigatória.";
  if (!data.owner.trim()) errors.owner = "Owner é obrigatório.";

  return errors;
}

export function EventCreatePage({
  currentUserRole = "team-member",
  currentUserName = "",
}: EventCreatePageProps) {
  const navigate = useNavigate();
  const { createEvent } = useEvents();

  const isAdmin = currentUserRole === "admin";
  const canCreate = canCreateEvent(currentUserRole);

  const [form, setForm] = useState<EventFormData>({
    title: "",
    date: "",
    description: "",
    owner: currentUserName,
  });
  const [errors, setErrors] = useState<EventFormErrors>({});

  function handleChange<K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit() {
    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const newEvent = createEvent({
      title: form.title,
      date: form.date,
      description: form.description,
      owner: isAdmin ? form.owner : currentUserName,
    });

    navigate(`/events/${newEvent.id}`);
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
        <div className="glass-card p-5 max-w-md grid gap-3 text-center">
          <p role="alert" style={{ color: "var(--color-text-secondary)" }}>
            Apenas Admin e Ministro podem criar Event.
          </p>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="justify-self-center px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-neutral-50)",
            }}
          >
            Voltar para Eventos
          </button>
        </div>
      </div>
    );
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

        <header className="glass-card p-4 flex items-center gap-3">
          <PlusCircle size={22} style={{ color: "var(--color-primary)" }} />
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-weight-extrabold)",
              }}
            >
              Criar Event
            </h1>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Todo Event novo é criado como rascunho
            </p>
          </div>
        </header>

        <section
          className="glass-card p-4 grid gap-3"
          aria-label="Formulário de criação de Event"
        >
          <FormField
            id="event-title"
            label="Título *"
            value={form.title}
            error={errors.title}
            onChange={(value) => handleChange("title", value)}
          />

          <div className="grid gap-1">
            <label
              htmlFor="event-date"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Data e Hora *
            </label>
            <div className="relative">
              <input
                id="event-date"
                type="datetime-local"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{
                  background: "var(--color-surface)",
                  borderColor: errors.date
                    ? "rgb(239 68 68)"
                    : "rgba(255,255,255,0.15)",
                }}
                aria-describedby={errors.date ? "event-date-error" : undefined}
                aria-invalid={!!errors.date}
              />
              <CalendarDays
                size={15}
                className="absolute right-3 top-2.5 pointer-events-none"
                style={{ color: "var(--color-text-secondary)" }}
              />
            </div>
            {errors.date && (
              <span
                id="event-date-error"
                className="text-xs text-red-500"
                role="alert"
              >
                {errors.date}
              </span>
            )}
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="event-description"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Descrição *
            </label>
            <textarea
              id="event-description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border min-h-24"
              style={{
                background: "var(--color-surface)",
                borderColor: errors.description
                  ? "rgb(239 68 68)"
                  : "rgba(255,255,255,0.15)",
              }}
              aria-describedby={
                errors.description ? "event-description-error" : undefined
              }
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <span
                id="event-description-error"
                className="text-xs text-red-500"
                role="alert"
              >
                {errors.description}
              </span>
            )}
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="event-owner"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Owner *
            </label>
            {isAdmin ? (
              <select
                id="event-owner"
                value={form.owner}
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
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="event-owner"
                type="text"
                value={currentUserName}
                disabled
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "var(--color-text-secondary)",
                }}
              />
            )}
            {errors.owner && (
              <span
                id="event-owner-error"
                className="text-xs text-red-500"
                role="alert"
              >
                {errors.owner}
              </span>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-neutral-50)",
              }}
            >
              Criar Event
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function FormField({ id, label, value, error, onChange }: FormFieldProps) {
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

export default EventCreatePage;
