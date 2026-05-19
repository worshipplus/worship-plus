import type { EventSource } from "../contracts/EventSource";
import type { Event } from "../../types/event";
import { mockEvents } from "../../mocks/eventMocks";

export const EVENT_DATA: Event[] = mockEvents;

export class MockEventSource implements EventSource {
  async getAll(): Promise<Event[]> {
    return [...mockEvents];
  }
}
