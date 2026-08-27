import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CitizenProfile } from "../../types";

export interface User extends CitizenProfile {
  username: string;
  password?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  register: (username: string, name: string, phone: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USER: User = {
  username: "sunita",
  password: "password",
  name: "Sunita Kumari",
  phone: "+91 98765 43210",
  email: "sunita.kumari@example.in",
  location: "Ranchi, Jharkhand",
  joinedDate: "2025-11-03",
  stats: {
    submitted: 8,
    resolved: 3,
    inProgress: 4,
    supportGiven: 21,
  },
  preferences: {
    smsEnabled: true,
    inAppEnabled: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage or initialize with DEFAULT_USER
    const storedUsers = localStorage.getItem("saathi_users");
    let userList: User[] = [];
    if (storedUsers) {
      userList = JSON.parse(storedUsers);
    } else {
      userList = [DEFAULT_USER];
      localStorage.setItem("saathi_users", JSON.stringify(userList));
    }
    setUsers(userList);

    // Load active logged-in user
    const storedActiveUser = localStorage.getItem("saathi_active_user");
    if (storedActiveUser) {
      const activeUser = JSON.parse(storedActiveUser);
      // Make sure the active user is in the list of users (to get any updates)
      const freshUser = userList.find((u) => u.username === activeUser.username) || activeUser;
      setCurrentUser(freshUser);
    }
    setLoading(false);
  }, []);

  const login = (username: string, password?: string): boolean => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("saathi_active_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (username: string, name: string, phone: string, password?: string) => {
    const userExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
      throw new Error("Username already exists.");
    }

    const newUser: User = {
      username,
      password,
      name,
      phone,
      email: `${username}@example.in`,
      location: "Ranchi, Jharkhand",
      joinedDate: new Date().toISOString().split("T")[0],
      stats: {
        submitted: 0,
        resolved: 0,
        inProgress: 0,
        supportGiven: 0,
      },
      preferences: {
        smsEnabled: true,
        inAppEnabled: true,
      },
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("saathi_users", JSON.stringify(updatedUsers));

    // Auto-login registered user
    setCurrentUser(newUser);
    localStorage.setItem("saathi_active_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("saathi_active_user");
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
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
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
