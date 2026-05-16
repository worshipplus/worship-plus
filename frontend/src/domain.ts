export type Role = "admin" | "minister" | "team_member";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  notes: string;
}

export interface EventSetlistItem {
  id: string;
  songId: string;
}

export interface EventRecord {
  id: string;
  title: string;
  scheduledAt: string;
  description: string;
  status: "draft";
  ownerId: string;
  createdById: string;
  setlist: EventSetlistItem[];
}

export interface EventFormValues {
  title: string;
  scheduledAt: string;
  description: string;
  ownerId: string;
}

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  minister: "Ministro",
  team_member: "Team Member",
};

export const mockUsers: User[] = [
  {
    id: "user-admin",
    name: "Ana Paula",
    role: "admin",
  },
  {
    id: "user-minister",
    name: "Lucas Pereira",
    role: "minister",
  },
  {
    id: "user-team-member",
    name: "Bia Costa",
    role: "team_member",
  },
];

export const mockSongs: Song[] = [
  {
    id: "song-graca",
    title: "Graça Sobre Graça",
    artist: "Diante do Trono",
    youtubeUrl: "https://www.youtube.com/watch?v=dt-graca",
    notes: "Entrada congregacional",
  },
  {
    id: "song-oceans",
    title: "Oceans",
    artist: "Hillsong United",
    youtubeUrl: "https://www.youtube.com/watch?v=oceans-live",
    notes: "Construção para ministrações",
  },
  {
    id: "song-bondade",
    title: "Bondade de Deus",
    artist: "Isaias Saad",
    youtubeUrl: "https://www.youtube.com/watch?v=bondade-de-deus",
    notes: "Momento de resposta",
  },
  {
    id: "song-vem",
    title: "Vem, Esta é a Hora",
    artist: "Aline Barros",
    youtubeUrl: "https://www.youtube.com/watch?v=vem-esta-e-a-hora",
    notes: "Chamada inicial",
  },
  {
    id: "song-santo",
    title: "Santo Pra Sempre",
    artist: "Gabriel Guedes",
    youtubeUrl: "https://www.youtube.com/watch?v=santo-pra-sempre",
    notes: "Fechamento com celebração",
  },
];

export const initialEvents: EventRecord[] = [
  {
    id: "event-domingo",
    title: "Culto de Domingo",
    scheduledAt: "2026-05-18T19:00",
    description:
      "Celebração principal com banda completa e recepção de novos membros.",
    status: "draft",
    ownerId: "user-minister",
    createdById: "user-admin",
    setlist: [
      { id: "event-song-1", songId: "song-graca" },
      { id: "event-song-2", songId: "song-oceans" },
    ],
  },
  {
    id: "event-jovens",
    title: "Noite de Jovens",
    scheduledAt: "2026-05-21T20:00",
    description: "Encontro de jovens com formato acústico e ministração curta.",
    status: "draft",
    ownerId: "user-admin",
    createdById: "user-admin",
    setlist: [{ id: "event-song-3", songId: "song-bondade" }],
  },
];

export function canCreateEvent(role: Role): boolean {
  return role === "admin" || role === "minister";
}

export function canManageEventSetlist(user: User, event: EventRecord): boolean {
  return user.role === "admin" || user.id === event.ownerId;
}

export function reorderSetlist<T>(
  items: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function createDefaultEventForm(ownerId: string): EventFormValues {
  return {
    title: "",
    scheduledAt: "",
    description: "",
    ownerId,
  };
}

export function formatEventDateTime(value: string): string {
  if (!value) {
    return "Data não definida";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}
