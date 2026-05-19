import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/user";
import { useDataSources } from "./providers";
import { GetAdminUserUseCase } from "../usecases/user/GetAdminUserUseCase";

type AuthContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { userSource } = useDataSources();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    new GetAdminUserUseCase(userSource).execute().then((user) => {
      setCurrentUser(user);
    });
  }, [userSource]);

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, setCurrentUser }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
