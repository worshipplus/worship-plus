export type { UserRole } from "./setlist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: import("./setlist").UserRole;
  createdAt: string;
}
