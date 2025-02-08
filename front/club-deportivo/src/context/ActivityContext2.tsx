"use client";


import { Activity2 } from "@/interface/IActivity2";
import { createContext, useState, useContext } from "react";

interface ActivitiesContextProps {
  activities: Activity2[];  // Usa Activity2
  addActivity: (activity: Omit<Activity2, "id">) => void;  // Usa Activity2
  removeActivity: (id: string) => void;
}

const ActivitiesContext = createContext<ActivitiesContextProps>({
  activities: [],
  addActivity: () => {},
  removeActivity: () => {},
});

export const ActivitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [activities, setActivities] = useState<Activity2[]>([]);  // Usa Activity2

  const addActivityHandler = (activity: Omit<Activity2, "id">) => {  // Usa Activity2
    try {
      const newActivity: Activity2 = { 
        ...activity, 
        id: crypto.randomUUID() 
      };
      setActivities((prev) => [...prev, newActivity]);
    } catch (error) {
      console.error("Error al agregar actividad:", error);
    }
  };

  const removeActivityHandler = (id: string) => {
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