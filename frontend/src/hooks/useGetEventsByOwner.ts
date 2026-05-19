import { useState, useEffect } from "react";
import type { Event } from "../types/event";
import { useDataSources } from "../context/providers";
import { GetEventsByOwnerUseCase } from "../usecases/event/GetEventsByOwnerUseCase";

export function useGetEventsByOwner(ownerId?: string): {
  data: Event[];
  loading: boolean;
  error: Error | null;
} {
  const { eventSource } = useDataSources();
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    new GetEventsByOwnerUseCase(eventSource)
      .execute(ownerId)
      .then((events) => {
        if (!cancelled) {
          setData(events);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [eventSource, ownerId]);

  return { data, loading, error };
}
