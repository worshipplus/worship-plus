import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import { resolveMemberAllowedRoles } from "../../domain/scale/memberRoles";
import type { UserRole, Event, ScaleEntry } from "../../types/event";
import type { User } from "../../types/user";

export class AddToScaleUseCase {
  execute(
    callerRole: UserRole,
    callerId: string,
    event: Event | undefined,
    userId: string,
    userName: string,
    papel: string | undefined,
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
    const member = allUsers.find((u) => u.id === userId);
    if (!member) {
      throw new DomainError(
        DomainErrorCode.USER_NOT_FOUND_IN_SCALE,
        "Integrante não encontrado na base.",
        { userId },
      );
    }

    const allowedRoles = resolveMemberAllowedRoles(member);
    if (allowedRoles.length === 0) {
      throw new DomainError(
        DomainErrorCode.INVALID_SCALE_ROLE,
        "Papel inválido para o integrante.",
      );
    }
    const suggestedRole = allowedRoles[0];
    const selectedRole = papel?.trim() || suggestedRole;

    if (!allowedRoles.includes(selectedRole)) {
      throw new DomainError(
        DomainErrorCode.INVALID_SCALE_ROLE,
        "Papel inválido para o integrante.",
        { papel: selectedRole },
      );
    }

    return {
      id: String(Date.now()),
      userId,
      userName,
      papel: selectedRole,
    };
  }
}
