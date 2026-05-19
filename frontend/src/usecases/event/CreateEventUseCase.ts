import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { UserRole, Event } from "../../types/event";
import type { User } from "../../types/user";

export interface CreateEventCommand {
  title: string;
  date: string;
  description: string;
  ownerName: string;
}

export class CreateEventUseCase {
  execute(
    callerRole: UserRole,
    callerName: string,
    command: CreateEventCommand,
    allUsers: User[],
  ): Event {
    if (callerRole !== "admin" && callerRole !== "ministro") {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_CREATE_EVENT,
        "Sem privilégio para criar Event.",
      );
    }
    if (
      callerRole !== "admin" &&
      command.ownerName.trim() !== callerName.trim()
    ) {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_EDIT_OWNER,
        "Apenas Admin pode alterar o Owner.",
        { field: "owner" },
      );
    }
    if (!command.title.trim()) {
      throw new DomainError(
        DomainErrorCode.EVENT_REQUIRED_FIELDS,
        "Título é obrigatório.",
        { field: "title" },
      );
    }
    if (!command.date.trim()) {
      throw new DomainError(
        DomainErrorCode.EVENT_REQUIRED_FIELDS,
        "Data e hora são obrigatórias.",
        { field: "date" },
      );
    }
    if (!command.description.trim()) {
      throw new DomainError(
        DomainErrorCode.EVENT_REQUIRED_FIELDS,
        "Descrição é obrigatória.",
        { field: "description" },
      );
    }
    if (!command.ownerName.trim()) {
      throw new DomainError(
        DomainErrorCode.EVENT_REQUIRED_FIELDS,
        "Owner é obrigatório.",
        { field: "owner" },
      );
    }
    const parsedDate = new Date(command.date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new DomainError(
        DomainErrorCode.INVALID_EVENT_DATE,
        "Data e hora inválidas.",
        { field: "date" },
      );
    }
    const ownerName = command.ownerName.trim();
    const ownerId = allUsers.find((u) => u.name === ownerName)?.id ?? "";
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: command.title.trim(),
      date: parsedDate.toISOString(),
      description: command.description.trim(),
      owner: ownerName,
      owner_id: ownerId,
      status: "draft",
      eventSetlist: [],
      scale: [],
    };
  }
}
