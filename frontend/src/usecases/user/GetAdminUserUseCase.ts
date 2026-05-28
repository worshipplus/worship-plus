import type { UserSource } from "../../adapters/contracts/UserSource";
import type { User } from "../../types/user";

export class GetAdminUserUseCase {
  constructor(private readonly source: UserSource) {}

  async execute(): Promise<User | null> {
    const users = await this.source.getAll();
    return users.find((u) => u.role === "admin") ?? null;
  }
}
