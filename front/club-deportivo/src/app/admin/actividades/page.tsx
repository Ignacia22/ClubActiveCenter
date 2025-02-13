/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

// pages/admin/activities/page.tsx
"use client";

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

  console.log("Activities from context:", activities); // Log 1

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const activityList: Activity[] = Array.isArray(activities) ? activities : [];
  console.log("ActivityList after conversion:", activityList); // Log 2

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const filteredActivities: Activity[] = activityList.filter(
    (activity: Activity) =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("FilteredActivities:", filteredActivities); // Log 5

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
      console.log("Creando actividad:", newActivity);
      const result = await createActivity(newActivity);
      console.log("Resultado de crear actividad:", result);

      setIsCreateModalOpen(false);
      // Resetear el formulario
      setNewActivity({
        title: "",
        description: "",
        date: "",
        hour: "",
        maxPeople: 0,
        file: undefined, // Cambiar el tipo de string a undefined
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
      await cancelActivity(id);
      // No es necesario recargar las actividades aquí
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar actividad",
        text: "Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel de depuración */}
      <div className="bg-gray-800 rounded-lg p-4 text-white">
        <h3>Depuración de Actividades</h3>
        <pre>{JSON.stringify(activities, null, 2)}</pre>
      </div>

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

      {/* Tabla */}
      <ActivitiesTable
        activities={filteredActivities}
        onCancel={handleDeleteActivity}
        onEdit={(id) => console.log("Editar", id)}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

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
