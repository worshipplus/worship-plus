import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type {
  UserRole,
  SetlistItem,
  SetlistFormData,
} from "../../types/setlist";

const YOUTUBE_REGEX =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

export class AddSetlistItemUseCase {
  execute(callerRole: UserRole, command: SetlistFormData): SetlistItem {
    if (callerRole !== "admin" && callerRole !== "ministro") {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_SETLIST,
        "Sem privilégio para adicionar item ao Setlist.",
      );
    }
    if (!command.title.trim()) {
      throw new DomainError(
        DomainErrorCode.SETLIST_REQUIRED_FIELDS,
        "Título é obrigatório.",
        { field: "title" },
      );
    }
    if (!command.author.trim()) {
      throw new DomainError(
        DomainErrorCode.SETLIST_REQUIRED_FIELDS,
        "Autor é obrigatório.",
        { field: "author" },
      );
    }
    if (!command.youtubeUrl.trim()) {
      throw new DomainError(
        DomainErrorCode.INVALID_YOUTUBE_URL,
        "Link do YouTube é obrigatório.",
        { field: "youtubeUrl" },
      );
    }
    if (!YOUTUBE_REGEX.test(command.youtubeUrl.trim())) {
      throw new DomainError(
        DomainErrorCode.INVALID_YOUTUBE_URL,
        "Insira um link válido do YouTube.",
        { field: "youtubeUrl" },
      );
    }
    return {
      id: String(Date.now()),
      title: command.title.trim(),
      author: command.author.trim(),
      key: command.key?.trim() || undefined,
      youtubeUrl: command.youtubeUrl.trim(),
      createdAt: new Date().toISOString(),
    };
  }
}
