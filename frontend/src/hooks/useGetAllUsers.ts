import { useState, useEffect } from "react";
import type { User } from "../types/user";
import { useDataSources } from "../context/providers";
import { GetAllUsersUseCase } from "../usecases/user/GetAllUsersUseCase";

export function useGetAllUsers(): {
  data: User[];
  loading: boolean;
  error: Error | null;
} {
  const { userSource } = useDataSources();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    new GetAllUsersUseCase(userSource)
      .execute()
      .then((users) => {
        if (!cancelled) {
          setData(users);
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
  }, [userSource]);

  return { data, loading, error };
}
