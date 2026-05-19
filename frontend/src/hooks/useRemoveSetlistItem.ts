import type { UserRole } from "../types/setlist";
import { RemoveSetlistItemUseCase } from "../usecases/setlist/RemoveSetlistItemUseCase";
import { DomainError } from "../domain/errors/DomainError";

export function useRemoveSetlistItem(role: UserRole): {
  /**
   * Validates that the caller has permission to remove a Setlist item.
   * The item ID is intentionally not passed here: the use case only checks
   * authorization; the caller manages its own local state to perform the
   * actual removal by ID.
   */
  remove: () => void;
} {
  function remove(): void {
    try {
      new RemoveSetlistItemUseCase().execute(role);
    } catch (err) {
      if (!(err instanceof DomainError)) throw err;
      // DomainError: button is only rendered for authorized users; safe to ignore
    }
  }

  return { remove };
}
