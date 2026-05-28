import type { SetlistSource } from "../contracts/SetlistSource";
import type { SetlistItem } from "../../types/setlist";
import { mockSetlistItems } from "../../mocks/setlistMocks";

export const SETLIST_DATA: SetlistItem[] = mockSetlistItems;

export class MockSetlistSource implements SetlistSource {
  async getAll(): Promise<SetlistItem[]> {
    return [...mockSetlistItems];
  }
}
