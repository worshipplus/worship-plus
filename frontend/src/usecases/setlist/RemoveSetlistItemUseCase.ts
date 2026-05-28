import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { UserRole } from "../../types/setlist";

export class RemoveSetlistItemUseCase {
  execute(callerRole: UserRole): void {
    if (callerRole !== "admin" && callerRole !== "ministro") {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_SETLIST,
        "Sem privilégio para remover item do Setlist.",
      );
    }
  }
}
