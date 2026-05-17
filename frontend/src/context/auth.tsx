import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/user";
import { mockUsers } from "../mocks/userMocks";

type AuthContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const defaultAdmin = mockUsers.find((u) => u.role === "admin") ?? null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultAdmin);

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
