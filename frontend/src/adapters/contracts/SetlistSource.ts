import type { SetlistItem } from "../../types/setlist";

export interface SetlistSource {
  getAll(): Promise<SetlistItem[]>;
}
