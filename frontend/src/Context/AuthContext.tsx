import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  username: string;
  token: string | null;
  setUser: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");

    if (storedToken) setToken(storedToken);
    if (storedName) setUsername(storedName);
  }, []);

  const setUser = (name: string, token: string) => {
    setUsername(name);
    setToken(token);
    localStorage.setItem("name", name);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUsername("");
    setToken(null);
    localStorage.removeItem("name");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ username, token, setUser, logout }}>
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
