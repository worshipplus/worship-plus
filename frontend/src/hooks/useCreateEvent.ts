import type { UserRole, Event } from "../types/event";
import type { User } from "../types/user";
import type { CreateEventCommand } from "../usecases/event/CreateEventUseCase";
import { CreateEventUseCase } from "../usecases/event/CreateEventUseCase";
import { DomainError } from "../domain/errors/DomainError";

export type CreateEventResult =
  | { ok: true; event: Event }
  | { ok: false; field: string; message: string };

export function useCreateEvent(
  role: UserRole,
  callerName: string,
  allUsers: User[],
): {
  createEvent: (command: CreateEventCommand) => CreateEventResult;
} {
  function createEvent(command: CreateEventCommand): CreateEventResult {
    try {
      const event = new CreateEventUseCase().execute(
        role,
        callerName,
        command,
        allUsers,
      );
      return { ok: true, event };
    } catch (err) {
      if (err instanceof DomainError) {
        const field =
          typeof err.details?.field === "string" ? err.details.field : "title";
        return { ok: false, field, message: err.message };
      }
      throw err;
    }
  }

  return { createEvent };
}
