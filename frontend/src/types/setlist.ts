export type UserRole = "admin" | "ministro" | "team-member";

export interface SetlistItem {
  id: string;
  title: string;
  author: string;
  key?: string;
  youtubeUrl: string;
  createdAt: string;
}

export interface SetlistFormData {
  title: string;
  author: string;
  key: string;
  youtubeUrl: string;
}
