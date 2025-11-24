import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  username: string;
  token: string | null;
  role: "student" | "tutor" | "";
  setUser: (
    username: string,
    token: string,
    id: string,
    role: "student" | "tutor"
  ) => void;
  logout: () => void;
  userId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "tutor" | "">("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role") as
      | "student"
      | "tutor"
      | null;

    if (storedToken) setToken(storedToken);
    if (storedName) setUsername(storedName);
    if (storedId) setUserId(storedId);
    if (storedRole) setRole(storedRole);

    setLoading(false);
  }, []);

  const setUser = (
    name: string,
    token: string,
    id: string,
    userRole: "student" | "tutor"
  ) => {
    setUsername(name);
    setToken(token);
    setUserId(id);
    setRole(userRole);
    localStorage.setItem("name", name);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setUsername("");
    setToken(null);
    setUserId(null);
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ username, token, userId, role, setUser, logout, loading }}
    >
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
