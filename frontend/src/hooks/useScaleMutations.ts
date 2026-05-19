import type { UserRole, Event, ScaleEntry } from "../types/event";
import type { User } from "../types/user";
import { AddToScaleUseCase } from "../usecases/scale/AddToScaleUseCase";
import { RemoveFromScaleUseCase } from "../usecases/scale/RemoveFromScaleUseCase";
import { DomainError } from "../domain/errors/DomainError";

export type AddToScaleResult =
  | { ok: true; entry: ScaleEntry }
  | { ok: false; message: string };

export function useScaleMutations(
  role: UserRole,
  callerId: string,
  allUsers: User[],
): {
  addToScale: (
    event: Event | undefined,
    userId: string,
    userName: string,
    papel: string,
  ) => AddToScaleResult;
  removeFromScale: (event: Event | undefined) => void;
} {
  function addToScale(
    event: Event | undefined,
    userId: string,
    userName: string,
    papel: string,
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
      return { ok: true, entry };
    } catch (err) {
      if (err instanceof DomainError)
        return { ok: false, message: err.message };
      throw err;
    }
  }

  function removeFromScale(event: Event | undefined): void {
    try {
      new RemoveFromScaleUseCase().execute(role, callerId, event);
    } catch (err) {
      if (!(err instanceof DomainError)) throw err;
      // DomainError: button is only rendered for authorized users on unlocked events
    }
  }

  return { addToScale, removeFromScale };
}
