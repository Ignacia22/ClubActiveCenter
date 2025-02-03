"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Interfaz para las reservas
interface IReservation {
  id: number;
  title: string;
  date: string;
}

interface UserDashboardContextType {
  reservations: IReservation[];
  setReservations: (reservations: IReservation[]) => void;
}

const UserDashboardContext = createContext<
  UserDashboardContextType | undefined
>(undefined);

interface UserDashboardProviderProps {
  children: ReactNode;
}

export const UserDashboardProvider: React.FC<UserDashboardProviderProps> = ({
  children,
}) => {
  const [reservations, setReservations] = useState<IReservation[]>([]);

  return (
    <UserDashboardContext.Provider value={{ reservations, setReservations }}>
      {children}
    </UserDashboardContext.Provider>
  );
};

// Hook para usar el contexto
export const useUserDashboard = () => {
  const context = useContext(UserDashboardContext);
  if (!context) {
    throw new Error(
      "useUserDashboard debe ser usado dentro de un UserDashboardProvider"
    );
  }
  return context;
};
