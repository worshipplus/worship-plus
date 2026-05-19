export type { UserRole } from "./shared";

export type EventStatus = "draft" | "scheduled" | "locked";

export interface EventSetlistItem {
  id: string;
  title: string;
  author: string;
  key?: string;
  youtubeUrl: string;
}

export interface ScaleEntry {
  id: string;
  userId: string;
  userName: string;
  papel: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  status: EventStatus;
  owner: string;
  owner_id: string;
  description: string;
  eventSetlist: EventSetlistItem[];
  scale: ScaleEntry[];
}
