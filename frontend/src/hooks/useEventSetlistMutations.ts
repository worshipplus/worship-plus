import type { UserRole, Event, EventSetlistItem } from "../types/event";
import type { SetlistItem } from "../types/setlist";
import { AddToEventSetlistUseCase } from "../usecases/event/AddToEventSetlistUseCase";
import { RemoveFromEventSetlistUseCase } from "../usecases/event/RemoveFromEventSetlistUseCase";
import { DomainError } from "../domain/errors/DomainError";

export type AddToEventSetlistResult =
  | { ok: true; item: EventSetlistItem }
  | { ok: false; message: string };

export function useEventSetlistMutations(
  role: UserRole,
  callerName: string,
): {
  addSong: (
    event: Event | undefined,
    song: SetlistItem,
  ) => AddToEventSetlistResult;
  removeSong: (event: Event | undefined) => void;
} {
  function addSong(
    event: Event | undefined,
    song: SetlistItem,
  ): AddToEventSetlistResult {
    try {
      const item = new AddToEventSetlistUseCase().execute(
        role,
        callerName,
        event,
        song,
      );
      return { ok: true, item };
    } catch (err) {
      if (err instanceof DomainError)
        return { ok: false, message: err.message };
      throw err;
    }
  }

  function removeSong(event: Event | undefined): void {
    try {
      new RemoveFromEventSetlistUseCase().execute(role, callerName, event);
    } catch (err) {
      if (!(err instanceof DomainError)) throw err;
      // DomainError: button is only rendered for authorized users on unlocked events
    }
  }

  return { addSong, removeSong };
}
