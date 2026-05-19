import type { UserRole } from "../types/setlist";
import { RemoveSetlistItemUseCase } from "../usecases/setlist/RemoveSetlistItemUseCase";
import { DomainError } from "../domain/errors/DomainError";

export function useRemoveSetlistItem(role: UserRole): {
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
