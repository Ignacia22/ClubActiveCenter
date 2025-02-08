// pages/admin/activities.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Activity, CreateActivityDto } from '@/interface/IActivity';
import { CreateActivityModal } from '@/components/admin/CreateActivityModal';
import { ActivitiesTable } from '@/components/admin/ActivitiesTable';
import StatsCard from '@/components/InfoAdmin/StatsCard';

export default function ActivitiesDashboard() {
  const { 
    activities, 
    loading, 
    error, 
    getAllActivities, 
    createActivity, 
    deleteActivity 
  } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const activityList: Activity[] = Array.isArray(activities) ? activities : [];

  const [newActivity, setNewActivity] = useState<CreateActivityDto>({
    title: '',
    description: '',
    date: '',
    hour: '',
    maxPeople: 0,
    file: undefined
  });

  useEffect(() => {
    const fetchActivities = async () => {
      if (hasLoaded) return;
      try {
        await getAllActivities();
        setHasLoaded(true);
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    };
  
    fetchActivities();
  }, [getAllActivities, hasLoaded]);

  if (loading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const filteredActivities: Activity[] = activityList.filter((activity: Activity) => 
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newActivity.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    
    if (!newActivity.description.trim()) {
      alert('La descripción es obligatoria');
      return;
    }
    
    if (!newActivity.date) {
      alert('Selecciona una fecha');
      return;
    }
    
    if (!newActivity.hour) {
      alert('Selecciona una hora');
      return;
    }
    
    if (newActivity.maxPeople <= 0) {
      alert('El máximo de personas debe ser mayor a 0');
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await createActivity(newActivity);
      setIsCreateModalOpen(false);
      setNewActivity({
        title: '',
        description: '',
        date: '',
        hour: '',
        maxPeople: 0,
        file: undefined,
      });
      
    } catch (error) {
      console.error('Error al crear actividad:', error);
      alert('No se pudo crear la actividad. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivity(id);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-400 text-sm">/ Actividades</div>
          <h1 className="text-2xl font-bold text-white">Gestión de Actividades</h1>
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
        <StatsCard 
          title="Total Actividades" 
          value={activityList.length} 
        />
      </div>

      {/* Tabla */}
      <ActivitiesTable 
        activities={filteredActivities}
        onDelete={handleDeleteActivity}
        onEdit={(id) => console.log('Editar', id)}
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