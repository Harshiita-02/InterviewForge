import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UNAUTHORIZED_EVENT, tokenStore } from "../lib/apiClient";
import * as authService from "../services/authService";
import type { CurrentUser } from "../services/authService";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (changes: Partial<CurrentUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  // Only "loading" at first if a saved token needs to be checked with the backend
  const [loading, setLoading] = useState<boolean>(() => tokenStore.get() !== null);

  // On first load: if a token is saved, ask the backend who it belongs to
  useEffect(() => {
    if (!tokenStore.get()) {
      return;
    }
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser);
      })
      .catch(() => {
        tokenStore.clear();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The API client announces expired tokens; clear the user so routes redirect to Login
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    tokenStore.set(result.token);
    setUser(result.user);
  }, []);

  const signup = useCallback(
    async (fullName: string, email: string, password: string) => {
      await authService.signup({ fullName, email, password });
      await login(email, password); // the backend's signup returns no token, so log in right after
    },
    [login]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  // Lets a screen (like Settings) update the shown user without logging in again
  const updateUser = useCallback((changes: Partial<CurrentUser>) => {
    setUser((previous) => (previous ? { ...previous, ...changes } : previous));
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, updateUser }),
    [user, loading, login, signup, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}