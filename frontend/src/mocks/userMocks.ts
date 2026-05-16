import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Ana Lima",
    email: "ana.lima@worshipplus.app",
    role: "admin",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "u2",
    name: "Carlos Souza",
    email: "carlos.souza@worshipplus.app",
    role: "ministro",
    createdAt: "2024-01-05T09:00:00Z",
  },
  {
    id: "u3",
    name: "Fernanda Oliveira",
    email: "fernanda.oliveira@worshipplus.app",
    role: "team-member",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "u4",
    name: "Ricardo Mendes",
    email: "ricardo.mendes@worshipplus.app",
    role: "team-member",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "u5",
    name: "Juliana Castro",
    email: "juliana.castro@worshipplus.app",
    role: "team-member",
    createdAt: "2024-01-20T12:00:00Z",
  },
];
