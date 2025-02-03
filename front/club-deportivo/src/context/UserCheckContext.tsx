// context/UserCheckContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

interface IUserCheckContext {
  isAuthenticated: boolean;
  user: { name: string } | null;
  login: (userData: { name: string }) => void;
  logout: () => void;
}

// Añadir el tipo `children` como `ReactNode`
interface UserCheckProviderProps {
  children: ReactNode;
}

const UserCheckContext = createContext<IUserCheckContext | undefined>(
  undefined
);

export const UserCheckProvider: React.FC<UserCheckProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: { name: string }) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserCheckContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </UserCheckContext.Provider>
  );
};

export const useUserCheck = (): IUserCheckContext => {
  const context = useContext(UserCheckContext);
  if (!context) {
    throw new Error("useUserCheck must be used within a UserCheckProvider");
  }
  return context;
};
