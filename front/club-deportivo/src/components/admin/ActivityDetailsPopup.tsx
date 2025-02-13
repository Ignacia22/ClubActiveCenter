"use client"

import { useState } from 'react';
import { Activity } from "@/interface/IActivity";

// Función de formateo de fecha
const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface ActivityDetailsPopupProps {
  activity: Activity;
  onClose: () => void;
  onReserve: () => void;
}

export function ActivityDetailsPopup({ activity, onClose, onReserve }: ActivityDetailsPopupProps) {
  const [isReserving, setIsReserving] = useState(false);

  // Manejar posibles valores undefined
  const registeredPeople = activity.registeredPeople ?? 0;
  const maxPeople = activity.maxPeople ?? 0;

  const handleReserve = async () => {
    setIsReserving(true);
    try {
      await onReserve();
      // Puedes agregar aquí un mensaje de éxito si lo deseas
    } catch (error) {
      console.error('Error al reservar:', error);
      // Manejo de errores
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">{activity.title}</h2>
        <p className="mb-4 text-black">{activity.description}</p>
        <p className="mb-2 text-black"><strong>Fecha:</strong> {formatDate(activity.date)}</p>
        <p className="mb-2 text-black"><strong>Hora:</strong> {activity.hour}</p>
        <p className="mb-2 text-black">
          <strong>Cupos disponibles:</strong> {Math.max(0, maxPeople - registeredPeople)}
        </p>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2"
          >
            Cerrar
          </button>
          <button
            onClick={handleReserve}
            disabled={isReserving || maxPeople <= registeredPeople}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
          >
            {isReserving ? 'Reservando...' : 'Reservar cupo'}
          </button>
        </div>
      </div>
    </div>
  );
}