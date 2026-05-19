import type { UserRole, SetlistItem, SetlistFormData } from "../types/setlist";
import type { EditedSetlistFields } from "../usecases/setlist/EditSetlistItemUseCase";
import { AddSetlistItemUseCase } from "../usecases/setlist/AddSetlistItemUseCase";
import { EditSetlistItemUseCase } from "../usecases/setlist/EditSetlistItemUseCase";
import { DomainError } from "../domain/errors/DomainError";

export type UpsertSetlistResult =
  | { ok: true; item: SetlistItem | EditedSetlistFields }
  | { ok: false; field: string; message: string };

export function useUpsertSetlistItem(role: UserRole): {
  upsert: (
    editingId: string | null,
    form: SetlistFormData,
  ) => UpsertSetlistResult;
} {
  function upsert(
    editingId: string | null,
    form: SetlistFormData,
  ): UpsertSetlistResult {
    try {
      const item = editingId
        ? new EditSetlistItemUseCase().execute(role, form)
        : new AddSetlistItemUseCase().execute(role, form);
      return { ok: true, item };
    } catch (err) {
      if (err instanceof DomainError) {
        const field =
          typeof err.details?.field === "string" ? err.details.field : "title";
        return { ok: false, field, message: err.message };
      }
      throw err;
    }
  }

  return { upsert };
}
