import type { SetlistSource } from "../contracts/SetlistSource";
import type { SetlistItem } from "../../types/setlist";

export class HttpSetlistSource implements SetlistSource {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<SetlistItem[]> {
    const res = await fetch(`${this.baseUrl}/api/setlist`);
    if (!res.ok) throw new Error(`Erro ao buscar setlist: ${res.status}`);
    return res.json() as Promise<SetlistItem[]>;
  }
}
