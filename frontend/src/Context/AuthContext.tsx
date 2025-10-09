import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  username: string;
  token: string | null;
  userId: string | null;
  loading: boolean;
  setUser: (name: string, token: string, id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    const nameFromURL = params.get("name");
    const idFromURL = params.get("id");

    if (tokenFromURL && nameFromURL && idFromURL) {
      setUser(nameFromURL, tokenFromURL, idFromURL);

      window.history.replaceState({}, "", window.location.pathname);
      setLoading(false);
      return;
    }

    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedId = localStorage.getItem("userId");

    if (storedToken && storedName && storedId) {
      setToken(storedToken);
      setUsername(storedName);
      setUserId(storedId);
    }

    setLoading(false);
  }, []);

  const setUser = (name: string, token: string, id: string) => {
    setUsername(name);
    setToken(token);
    setUserId(id);
    localStorage.setItem("name", name);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
  };

  const logout = () => {
    setUsername("");
    setToken(null);
    setUserId(null);
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{ username, token, userId, loading, setUser, logout }}
    >
      {!loading && children}
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
