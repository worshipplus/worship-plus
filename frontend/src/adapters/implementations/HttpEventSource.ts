import type { EventSource } from "../contracts/EventSource";
import type { Event } from "../../types/event";

export class HttpEventSource implements EventSource {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<Event[]> {
    const res = await fetch(`${this.baseUrl}/api/events`);
    if (!res.ok) throw new Error(`Erro ao buscar eventos: ${res.status}`);
    return res.json() as Promise<Event[]>;
  }
}
