/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Activity } from '@/interface/IActivity';
import Image from 'next/image';

export default function ActivitiesPage() {
  const { activities, getAllActivities } = useAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log detallado
  console.log('Actividades recibidas:', activities);

  // Extraer el array de actividades correctamente
  const activityList: Activity[] = Array.isArray(activities) 
    ? activities 
    : (activities as any)?.activities || [];

  // Filtrar actividades activas o futuras
  const availableActivities = activityList.filter((activity: Activity) => {
    const activityDate = new Date(activity.date);
    const today = new Date();
    return activityDate >= today; // Solo mostrar actividades futuras
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Si no hay actividades, obtenerlas
        if (activityList.length === 0) {
          await getAllActivities();
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setIsLoading(false);
      }
    };
  
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen px-4 sm:px-6 lg:px-8">
        <p className="text-center text-red-500">Error al cargar actividades: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-black">
      <h1 className="text-center text-3xl font-bold mb-8 text-white">Actividades Disponibles</h1>

      {availableActivities.length === 0 ? (
        <p className="text-center text-gray-500">No hay actividades disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableActivities.map((activity: Activity) => (
            <div 
              key={activity.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              {activity.imagenUrl ? (
                <Image 
                  src={activity.imagenUrl} 
                  alt={activity.title} 
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{activity.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Fecha:</span> {activity.date}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Hora:</span> {activity.hour}
                    </p>
                  </div>
                  
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 flex justify-between">
                  <span>Máximo: {activity.maxPeople} personas</span>
                  <span>Registrados: {activity.registeredPeople}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}