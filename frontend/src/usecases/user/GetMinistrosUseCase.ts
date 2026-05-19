import type { UserSource } from "../../adapters/contracts/UserSource";
import type { User } from "../../types/user";

export class GetMinistrosUseCase {
  constructor(private readonly source: UserSource) {}

  async execute(): Promise<User[]> {
    const users = await this.source.getAll();
    return users.filter((u) => u.role === "ministro");
  }
}
