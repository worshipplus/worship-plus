import { DomainError } from "../../domain/errors/DomainError";
import { DomainErrorCode } from "../../domain/errors/DomainErrorCode";
import type { UserRole, SetlistFormData } from "../../types/setlist";

const YOUTUBE_REGEX =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

export interface EditedSetlistFields {
  title: string;
  author: string;
  key?: string;
  youtubeUrl: string;
}

export class EditSetlistItemUseCase {
  execute(callerRole: UserRole, command: SetlistFormData): EditedSetlistFields {
    if (callerRole !== "admin" && callerRole !== "ministro") {
      throw new DomainError(
        DomainErrorCode.UNAUTHORIZED_SETLIST,
        "Sem privilégio para editar o Setlist.",
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
      title: command.title.trim(),
      author: command.author.trim(),
      key: command.key?.trim() || undefined,
      youtubeUrl: command.youtubeUrl.trim(),
    };
  }
}
