import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, type User } from "../../lib/api";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, name: string, phone: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const user = await api.login({ email, password });
      setCurrentUser(user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (email: string, name: string, phone: string, password?: string) => {
    const user = await api.register({ email, name, phone, password });
    setCurrentUser(user);
  };

  const logout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-alt">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-teal-600" />
          <p className="text-sm font-medium text-ink-600">Loading Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
