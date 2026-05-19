import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { UserRole, Event, EventSetlistItem } from "../../types/event";
import type { SetlistItem } from "../../types/setlist";

export class AddToEventSetlistUseCase {
  execute(
    callerRole: UserRole,
    callerName: string,
    event: Event | undefined,
    song: SetlistItem,
  ): EventSetlistItem {
    if (!event) {
      throw new DomainError(
        DomainErrorCode.EVENT_NOT_FOUND,
        "Evento não encontrado.",
      );
    }
    if (event.status === "locked") {
      throw new DomainError(
        DomainErrorCode.EVENT_LOCKED,
        "Evento finalizado não aceita alterações.",
      );
    }
    if (callerRole !== "admin" && event.owner !== callerName) {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_EDIT_EVENT_SETLIST,
        "Sem privilégio para editar o Event Setlist.",
      );
    }
    const isDuplicate = event.eventSetlist.some(
      (item) =>
        item.title === song.title &&
        item.author === song.author &&
        item.youtubeUrl === song.youtubeUrl,
    );
    if (isDuplicate) {
      throw new DomainError(
        DomainErrorCode.DUPLICATE_SETLIST_ITEM,
        "Música já adicionada ao Event Setlist.",
      );
    }
    return {
      id: `${song.id}-${Date.now()}`,
      title: song.title,
      author: song.author,
      key: song.key,
      youtubeUrl: song.youtubeUrl,
    };
  }
}
