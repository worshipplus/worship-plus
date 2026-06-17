import type { UserRole, Event, EventSetlistItem } from "../types/event";
import type { SetlistItem } from "../types/setlist";
import { AddToEventSetlistUseCase } from "../usecases/event/AddToEventSetlistUseCase";
import { RemoveFromEventSetlistUseCase } from "../usecases/event/RemoveFromEventSetlistUseCase";
import { DomainError } from "../domain/errors/DomainError";

export type AddToEventSetlistResult =
  | { ok: true; item: EventSetlistItem }
  | { ok: false; message: string };

export type RemoveFromEventSetlistResult =
  | { ok: true; updatedSetlist: EventSetlistItem[] }
  | { ok: false; message: string };

export function useEventSetlistMutations(
  role: UserRole,
  callerName: string,
): {
  addSong: (
    event: Event | undefined,
    song: SetlistItem,
  ) => AddToEventSetlistResult;
  removeSong: (
    event: Event | undefined,
    songId: string,
  ) => RemoveFromEventSetlistResult;
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

  function removeSong(
    event: Event | undefined,
    songId: string,
  ): RemoveFromEventSetlistResult {
    try {
      const updatedSetlist = new RemoveFromEventSetlistUseCase().execute(
        role,
        callerName,
        event,
        songId,
      );
      return { ok: true, updatedSetlist };
    } catch (err) {
      if (err instanceof DomainError)
        return { ok: false, message: err.message };
      throw err;
    }
  }

  return { addSong, removeSong };
}
