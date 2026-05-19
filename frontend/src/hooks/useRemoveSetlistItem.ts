import type { UserRole } from "../types/setlist";
import { RemoveSetlistItemUseCase } from "../usecases/setlist/RemoveSetlistItemUseCase";
import { DomainError } from "../domain/errors/DomainError";

export type RemoveSetlistItemResult =
  | { ok: true }
  | { ok: false; message: string };

export function useRemoveSetlistItem(role: UserRole): {
  /**
   * Validates that the caller has permission to remove a Setlist item.
   * Returns `{ ok: true }` on success or `{ ok: false; message }` when
   * a DomainError is thrown (e.g. insufficient privileges).
   * Non-domain errors are re-thrown.
   */
  remove: () => RemoveSetlistItemResult;
} {
  function remove(): RemoveSetlistItemResult {
    try {
      new RemoveSetlistItemUseCase().execute(role);
      return { ok: true };
    } catch (err) {
      if (err instanceof DomainError)
        return { ok: false, message: err.message };
      throw err;
    }
  }

  return { remove };
}
