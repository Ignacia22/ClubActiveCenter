"use client";

import { Activity } from "@/interface/IActivity";
import { createContext, useState, useContext } from "react";

interface ActivitiesContextProps {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => void;
  removeActivity: (id: number) => void;
}

const ActivitiesContext = createContext<ActivitiesContextProps>({
  activities: [],
  addActivity: () => {},
  removeActivity: () => {},
});

export const ActivitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Agregar nueva actividad
  const addActivityHandler = (activity: Omit<Activity, "id">) => {
    try {
      const newActivity: Activity = { ...activity, id: Date.now() }; // Asegúrate de agregar un id único
      setActivities((prev) => [...prev, newActivity]);
    } catch (error) {
      console.error("Error al agregar actividad:", error);
    }
  };

  // Eliminar actividad
  const removeActivityHandler = (id: number) => {
    try {
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    }
  };

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        addActivity: addActivityHandler,
        removeActivity: removeActivityHandler,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error("useActivities debe usarse dentro de un ActivitiesProvider");
  }
  return context;
};
