import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { Event, ScaleEntry, UserRole } from "../../types/event";
import type { User } from "../../types/user";
import { resolveMemberAllowedRoles } from "./memberRoles";

export class UpdateScaleMemberRoleUseCase {
  execute(
    callerRole: UserRole,
    callerId: string,
    event: Event | undefined,
    memberId: string,
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

    const scaleMember = event.scale.find((entry) => entry.userId === memberId);
    if (!scaleMember) {
      throw new DomainError(
        DomainErrorCode.USER_NOT_FOUND_IN_SCALE,
        "Integrante não encontrado na Escala.",
        { memberId },
      );
    }

    const member = allUsers.find((user) => user.id === memberId);
    if (!member) {
      throw new DomainError(
        DomainErrorCode.USER_NOT_FOUND_IN_SCALE,
        "Integrante não encontrado na base.",
        { memberId },
      );
    }

    const allowedRoles = resolveMemberAllowedRoles(member);
    if (!allowedRoles.includes(papel)) {
      throw new DomainError(
        DomainErrorCode.INVALID_SCALE_ROLE,
        "Papel inválido para o integrante.",
        { papel },
      );
    }

    return { ...scaleMember, papel };
  }
}
