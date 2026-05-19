import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { UserRole, Event } from "../../types/event";

export class RemoveFromScaleUseCase {
  execute(
    callerRole: UserRole,
    callerId: string,
    event: Event | undefined,
  ): void {
    if (!event) {
      throw new DomainError(
        DomainErrorCode.EVENT_NOT_FOUND,
        "Evento não encontrado.",
      );
    }
    if (event.status === "locked") {
      throw new DomainError(
        DomainErrorCode.EVENT_LOCKED,
        "Evento finalizado não aceita alterações.",
      );
    }
    if (callerRole !== "admin" && callerId !== event.owner_id) {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_EDIT_SCALE,
        "Sem privilégio para editar a Escala.",
      );
    }
  }
}
