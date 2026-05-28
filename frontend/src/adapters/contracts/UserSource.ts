import type { User } from "../../types/user";

export interface UserSource {
  getAll(): Promise<User[]>;
}
