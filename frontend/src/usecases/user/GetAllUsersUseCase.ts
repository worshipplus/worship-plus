import type { UserSource } from "../../adapters/contracts/UserSource";
import type { User } from "../../types/user";

export class GetAllUsersUseCase {
  constructor(private readonly source: UserSource) {}

  async execute(): Promise<User[]> {
    return this.source.getAll();
  }
}
