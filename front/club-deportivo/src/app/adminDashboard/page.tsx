"use client"

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import AddActivityModal from '@/components/AddActivityModal';
import { AdminRoute } from '@/components/RutasMenu/AdminRoute';

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminRoute>
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto py-4 px-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de administración</h1>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Salir</button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-4 my-6">
          <StatCard title="Reservas Totales" value="356" icon="📊" />
          <StatCard title="Usuarios Activos" value="123" icon="👤" />
          <StatCard title="Actividades Programadas" value="10" icon="⏱️" />
          <StatCard title="Mantenimiento" value="3 Pendientes" icon="🛠️" />
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-300 p-4 rounded-lg">Calendario</div>
          <div className="bg-gray-300 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Usuarios Recientes</h2>
            <ul>
              <li className="mb-2">Ana Gómez - Reservas: 5</li>
              <li className="mb-2">Pedro Valdés - Reservas: 2</li>
              <li>Mauricio Cortez - Reservas: 20</li>
            </ul>
          </div>
        </div>

        {/* Botón para agregar actividad */}
        <div className="text-right mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Agregar Actividad
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && <AddActivityModal onClose={() => setShowModal(false)} />}
    </div>
    </AdminRoute>
  );
}
