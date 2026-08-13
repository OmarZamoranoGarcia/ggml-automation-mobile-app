import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { registerUnauthorizedHandler } from "../services/api-client";
import {
  clearSession,
  getToken,
  getUser,
  StoredUser,
} from "../services/storage.service";

interface AuthContextType {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: StoredUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
    // Cuando apiFetch detecte un 401 en cualquier request, esto se ejecuta
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  const loadSession = async () => {
    try {
      const token = await getToken();
      const storedUser = await getUser();
      setUser(token && storedUser ? storedUser : null);
    } finally {
      setIsLoading(false);
    }
  };

  const setSession = (loggedUser: StoredUser) => {
    setUser(loggedUser);
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
