import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import { ALLOWED_PAPEIS } from "../../domain/constants/scale";
import type { UserRole, Event, ScaleEntry } from "../../types/event";
import type { User } from "../../types/user";

export class AddToScaleUseCase {
  execute(
    callerRole: UserRole,
    callerId: string,
    event: Event | undefined,
    userId: string,
    userName: string,
    papel: string,
    allUsers: User[],
  ): ScaleEntry {
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
    const userExists = allUsers.some((u) => u.id === userId);
    if (!userExists) {
      throw new DomainError(
        DomainErrorCode.USER_NOT_FOUND_IN_SCALE,
        "Integrante não encontrado na base.",
        { userId },
      );
    }
    if (!(ALLOWED_PAPEIS as readonly string[]).includes(papel)) {
      throw new DomainError(
        DomainErrorCode.INVALID_SCALE_ROLE,
        "Papel inválido para a Escala.",
        { papel },
      );
    }
    return {
      id: String(Date.now()),
      userId,
      userName,
      papel,
    };
  }
}
