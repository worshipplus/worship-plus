import type { UserSource } from "../contracts/UserSource";
import type { User } from "../../types/user";

export class HttpUserSource implements UserSource {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<User[]> {
    const res = await fetch(`${this.baseUrl}/api/users`);
    if (!res.ok) throw new Error(`Erro ao buscar usuários: ${res.status}`);
    return res.json() as Promise<User[]>;
  }
}
