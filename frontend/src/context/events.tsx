import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockEvents } from "../mocks/eventMocks";
import type { Event, EventSetlistItem } from "../types/event";
import type { SetlistItem } from "../types/setlist";

type CreateEventInput = {
  title: string;
  date: string;
  description: string;
  owner: string;
};

type EventsContextValue = {
  events: Event[];
  createEvent: (input: CreateEventInput) => Event;
  addSongToEventSetlist: (eventId: string, song: SetlistItem) => void;
  removeEventSetlistItem: (eventId: string, itemId: string) => void;
  reorderEventSetlist: (
    eventId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

function buildEventSetlistItem(song: SetlistItem): EventSetlistItem {
  return {
    id: `${song.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: song.title,
    author: song.author,
    key: song.key,
    youtubeUrl: song.youtubeUrl,
  };
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      createEvent: (input) => {
        const newEvent: Event = {
          id: String(Date.now()),
          title: input.title.trim(),
          date: input.date,
          description: input.description.trim(),
          owner: input.owner,
          status: "draft",
          eventSetlist: [],
        };

        setEvents((prev) => [newEvent, ...prev]);
        return newEvent;
      },
      addSongToEventSetlist: (eventId, song) => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  eventSetlist: [
                    ...event.eventSetlist,
                    buildEventSetlistItem(song),
                  ],
                }
              : event,
          ),
        );
      },
      removeEventSetlistItem: (eventId, itemId) => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  eventSetlist: event.eventSetlist.filter(
                    (item) => item.id !== itemId,
                  ),
                }
              : event,
          ),
        );
      },
      reorderEventSetlist: (eventId, fromIndex, toIndex) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

        setEvents((prev) =>
          prev.map((event) => {
            if (event.id !== eventId) return event;
            if (
              fromIndex >= event.eventSetlist.length ||
              toIndex >= event.eventSetlist.length
            ) {
              return event;
            }

            const reordered = [...event.eventSetlist];
            const [moved] = reordered.splice(fromIndex, 1);
            reordered.splice(toIndex, 0, moved);

            return {
              ...event,
              eventSetlist: reordered,
            };
          }),
        );
      },
    }),
    [events],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents(): EventsContextValue {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within EventsProvider");
  }
  return context;
}
