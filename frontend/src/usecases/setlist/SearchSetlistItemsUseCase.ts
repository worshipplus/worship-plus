import type { SetlistSource } from "../../adapters/contracts/SetlistSource";
import type { SetlistItem } from "../../types/setlist";

export class SearchSetlistItemsUseCase {
  constructor(private readonly source: SetlistSource) {}

  async execute(query: string): Promise<SetlistItem[]> {
    const items = await this.source.getAll();
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q),
    );
  }
}
