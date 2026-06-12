import type { UserRole } from "./shared";

export type { UserRole };

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  primaryScaleRole: string;
  secondaryScaleRoles: string[];
  createdAt: string;
}
