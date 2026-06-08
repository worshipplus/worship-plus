import { ALLOWED_PAPEIS } from "../../domain/constants/scale";
import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { User } from "../../types/user";

const ALLOWED_ROLES = new Set<string>(ALLOWED_PAPEIS);

export function resolveMemberAllowedRoles(member: User): string[] {
  const primaryRole = member.primaryScaleRole.trim();
  if (!primaryRole || !ALLOWED_ROLES.has(primaryRole)) {
    throw new DomainError(
      DomainErrorCode.INVALID_SCALE_ROLE,
      "Papel inválido para o integrante.",
    );
  }

  const secondaryRoles = member.secondaryScaleRoles
    .map((role) => role.trim())
    .filter((role) => role.length > 0);

  const uniqueSecondaryRoles = new Set(secondaryRoles);

  if (uniqueSecondaryRoles.size !== secondaryRoles.length) {
    throw new DomainError(
      DomainErrorCode.INVALID_SCALE_ROLE,
      "Papel inválido para o integrante.",
    );
  }

  for (const role of uniqueSecondaryRoles) {
    if (!ALLOWED_ROLES.has(role) || role === primaryRole) {
      throw new DomainError(
        DomainErrorCode.INVALID_SCALE_ROLE,
        "Papel inválido para o integrante.",
      );
    }
  }

  return [primaryRole, ...uniqueSecondaryRoles];
}
