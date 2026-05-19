import type { Event } from "../../types/event";

export interface EventSource {
  getAll(): Promise<Event[]>;
}
