import { useState, useEffect } from "react";
import type { SetlistItem } from "../types/setlist";
import { useDataSources } from "../context/providers";
import { SearchSetlistItemsUseCase } from "../usecases/setlist/SearchSetlistItemsUseCase";

export function useSearchSetlist(query = ""): {
  data: SetlistItem[];
  loading: boolean;
  error: Error | null;
} {
  const { setlistSource } = useDataSources();
  const [data, setData] = useState<SetlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    new SearchSetlistItemsUseCase(setlistSource)
      .execute(query)
      .then((items) => {
        if (!cancelled) {
          setData(items);
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
  }, [setlistSource, query]);

  return { data, loading, error };
}
