import type { UserRole, Event, ScaleEntry } from "../types/event";
import type { User } from "../types/user";
import { AddToScaleUseCase } from "../usecases/scale/AddToScaleUseCase";
import { RemoveFromScaleUseCase } from "../usecases/scale/RemoveFromScaleUseCase";
import { UpdateScaleMemberRoleUseCase } from "../usecases/scale/UpdateScaleMemberRoleUseCase";
import { DomainError } from "../domain/errors/DomainError";
import { DomainErrorCode } from "../domain/errors/DomainErrorCode";

export type AddToScaleResult =
  | { ok: true; entry: ScaleEntry; domainEvent: "MemberRoleSetInEvent" }
  | ScaleMutationError;

export type RemoveFromScaleResult = { ok: true } | ScaleMutationError;

export type UpdateScaleRoleResult =
  | { ok: true; entry: ScaleEntry; domainEvent: "MemberRoleUpdatedInEvent" }
  | ScaleMutationError;

type ScaleMutationError = {
  ok: false;
  code: string;
  statusCode: number;
  message: string;
  domainEvent: "RoleChangeDenied" | "LockedEventMutationBlocked";
};

function mapDomainError(err: DomainError): ScaleMutationError {
  if (err.code === DomainErrorCode.UNAUTHORIZED_EDIT_SCALE) {
    return {
      ok: false,
      code: err.code,
      statusCode: 403,
      message: "Você não tem permissão para editar a escala deste evento.",
      domainEvent: "RoleChangeDenied",
    };
  }
  if (err.code === DomainErrorCode.EVENT_LOCKED) {
    return {
      ok: false,
      code: err.code,
      statusCode: 409,
      message:
        "Este evento está finalizado e não permite alterações na escala.",
      domainEvent: "LockedEventMutationBlocked",
    };
  }
  if (err.code === DomainErrorCode.INVALID_SCALE_ROLE) {
    return {
      ok: false,
      code: err.code,
      statusCode: 400,
      message: "Selecione um papel válido para este integrante.",
      domainEvent: "RoleChangeDenied",
    };
  }
  return {
    ok: false,
    code: err.code,
    statusCode: 400,
    message: err.message,
    domainEvent: "RoleChangeDenied",
  };
}

export function useScaleMutations(
  role: UserRole,
  callerId: string,
  allUsers: User[],
): {
  addToScale: (
    event: Event | undefined,
    userId: string,
    userName: string,
    papel?: string,
  ) => AddToScaleResult;
  removeFromScale: (event: Event | undefined) => RemoveFromScaleResult;
  updateScaleRole: (
    event: Event | undefined,
    memberId: string,
    papel: string,
  ) => UpdateScaleRoleResult;
} {
  function addToScale(
    event: Event | undefined,
    userId: string,
    userName: string,
    papel?: string,
  ): AddToScaleResult {
    try {
      const entry = new AddToScaleUseCase().execute(
        role,
        callerId,
        event,
        userId,
        userName,
        papel,
        allUsers,
      );
      return { ok: true, entry, domainEvent: "MemberRoleSetInEvent" };
    } catch (err) {
      if (err instanceof DomainError) return mapDomainError(err);
      throw err;
    }
  }

  function removeFromScale(event: Event | undefined): RemoveFromScaleResult {
    try {
      new RemoveFromScaleUseCase().execute(role, callerId, event);
      return { ok: true };
    } catch (err) {
      if (err instanceof DomainError) return mapDomainError(err);
      throw err;
    }
  }

  function updateScaleRole(
    event: Event | undefined,
    memberId: string,
    papel: string,
  ): UpdateScaleRoleResult {
    try {
      const entry = new UpdateScaleMemberRoleUseCase().execute(
        role,
        callerId,
        event,
        memberId,
        papel,
        allUsers,
      );
      return { ok: true, entry, domainEvent: "MemberRoleUpdatedInEvent" };
    } catch (err) {
      if (err instanceof DomainError) return mapDomainError(err);
      throw err;
    }
  }

  return { addToScale, removeFromScale, updateScaleRole };
}
