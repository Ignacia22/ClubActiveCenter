"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { IUser } from "../interface/IUser";
import { ILogin } from "../interface/ILogin";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (form: ILogin) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
    }
  }, []);

  const login = async (form: ILogin) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      form
    );
    setUser(response.data.user);
    setToken(response.data.token);

    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
    router.push("/Home");
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/Home");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
