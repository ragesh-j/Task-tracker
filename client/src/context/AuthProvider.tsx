import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../api/axios";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<User>("/auth/login", { email, password });
    setUser(res.data);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await api.post<User>("/auth/signup", { name, email, password });
    setUser(res.data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}