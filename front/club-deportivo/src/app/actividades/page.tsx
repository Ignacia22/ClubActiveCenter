"use client"

import { useActivities } from "@/context/activityContext";


export default function ActivitiesPage() {
  const { activities,  } = useActivities(); // Obtenemos las actividades y la función de eliminación desde el contexto

  return (
    <div className="h-screen px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold my-6">Actividades Disponibles</h1>

      {activities.length === 0 ? (
        <p className="text-center text-gray-500">No hay actividades disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold">{activity.title}</h3>
              <p className="text-gray-700">{activity.descripcion}</p>
              <div className="mt-4 flex justify-between items-center">
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
