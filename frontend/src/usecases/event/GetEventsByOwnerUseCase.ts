import type { EventSource } from "../../adapters/contracts/EventSource";
import type { Event } from "../../types/event";

export class GetEventsByOwnerUseCase {
  constructor(private readonly source: EventSource) {}

  async execute(ownerId?: string): Promise<Event[]> {
    const events = await this.source.getAll();
    if (!ownerId) return events;
    return events.filter((e) => e.owner_id === ownerId);
  }
}
