/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Activity, CreateActivityDto } from "@/interface/IActivity";
import { CreateActivityModal } from "@/components/admin/CreateActivityModal";
import { ActivitiesTable } from "@/components/admin/ActivitiesTable";
import StatsCard from "@/components/InfoAdmin/StatsCard";
import Swal from "sweetalert2";

export default function ActivitiesDashboard() {
  const {
    activities,
    loading,
    error,
    getAllActivities,
    createActivity,
    cancelActivity,
  } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  
  // Asegurarse de que activities siempre sea un array
  const activityList: Activity[] = Array.isArray(activities) ? activities : [];

  const [newActivity, setNewActivity] = useState<CreateActivityDto>({
    title: "",
    description: "",
    date: "",
    hour: "",
    maxPeople: 0,
    file: undefined,
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await getAllActivities();
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  // Mostrar loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Cargando actividades...</div>
      </div>
    );
  }

  // Filtrar actividades
  const filteredActivities = activityList.filter((activity: Activity) => 
    activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!newActivity.title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    if (!newActivity.description.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    if (!newActivity.date) {
      alert("Selecciona una fecha");
      return;
    }

    if (!newActivity.hour) {
      alert("Selecciona una hora");
      return;
    }

    if (newActivity.maxPeople <= 0) {
      alert("El máximo de personas debe ser mayor a 0");
      return;
    }

    try {
      await createActivity(newActivity);
      setIsCreateModalOpen(false);
      setNewActivity({
        title: "",
        description: "",
        date: "",
        hour: "",
        maxPeople: 0,
        file: undefined,
      });
    } catch (error) {
      console.error("Error al crear actividad:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear actividad",
        text: "Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      setIsDeletingId(id);
      await cancelActivity(id);
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      alert('Error al eliminar la actividad. Por favor, intenta de nuevo.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-400 text-sm">/ Actividades</div>
          <h1 className="text-2xl font-bold text-white">
            Gestión de Actividades
          </h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-4 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="Total Actividades" value={activityList.length} />
      </div>

      {/* Estado vacío o tabla */}
      {activityList.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg mb-4">No hay actividades disponibles</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Crear nueva actividad
          </button>
        </div>
      ) : (
        <ActivitiesTable 
          activities={filteredActivities}
          onCancel={handleDeleteActivity}
          onEdit={(id) => console.log('Editar', id)}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateActivity}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
      />
    </div>
  );
}
