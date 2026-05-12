export type { UserRole } from "./setlist";

export type EventStatus = "draft" | "scheduled" | "locked";

export interface EventSetlistItem {
  id: string;
  title: string;
  author: string;
  key?: string;
  youtubeUrl: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  status: EventStatus;
  owner: string;
  description: string;
  eventSetlist: EventSetlistItem[];
}
