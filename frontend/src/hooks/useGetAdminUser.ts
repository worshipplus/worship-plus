import { useState, useEffect } from "react";
import type { User } from "../types/user";
import { useDataSources } from "../context/providers";
import { GetAdminUserUseCase } from "../usecases/user/GetAdminUserUseCase";

export function useGetAdminUser(): {
  data: User | null;
  loading: boolean;
  error: Error | null;
} {
  const { userSource } = useDataSources();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    new GetAdminUserUseCase(userSource)
      .execute()
      .then((user) => {
        if (!cancelled) {
          setData(user);
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
