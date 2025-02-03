"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

// Interfaz de usuario
interface IUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: IUser | null;
  login: (data: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  // Verificar si hay datos guardados en localStorage al cargar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Cargar usuario desde localStorage
      } catch (error) {
        console.error("Error al parsear el usuario desde localStorage:", error);
        // Eliminar datos corruptos de localStorage si no se puede parsear
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Función de login
  const login = (data: IUser) => {
    setUser(data); // Actualiza el estado del usuario
    localStorage.setItem("user", JSON.stringify(data)); // Guarda el usuario en localStorage
    localStorage.setItem("token", data.token); // Guarda el token si es necesario
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
