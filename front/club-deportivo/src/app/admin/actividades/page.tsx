'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Activity, CreateActivityDto } from '@/interface/IActivity';
import Image from 'next/image';

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
    registeredPeople: 0,
    status: 'active',
    imagenUrl: ''
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
  

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Filtered activities with explicit type
  const filteredActivities: Activity[] = activityList.filter((activity: Activity) => 
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones
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
      console.log('Creando actividad:', newActivity);
      const result = await createActivity(newActivity);
      console.log('Resultado de crear actividad:', result);
      
      setIsCreateModalOpen(false);
      // Resetear el formulario
      setNewActivity({
        title: '',
        description: '',
        date: '',
        hour: '',
        maxPeople: 0,
        registeredPeople: 0,
        status: 'active',
        imagenUrl: ''
      });
    } catch (error) {
      console.error('Error al crear actividad:', error);
      alert('No se pudo crear la actividad. Por favor, inténtalo de nuevo.');
    }
  };

  
  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteActivity(id);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Depuración */}
      <div className="bg-gray-800 rounded-lg p-4 text-white">
        <h3>Depuración de Actividades</h3>
        <pre>{JSON.stringify(activities, null, 2)}</pre>
      </div>

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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Total Actividades</h3>
          <p className="text-2xl font-bold text-white">{activityList.length}</p>
        </div>
      </div>

      {/* Tabla de Actividades */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Lista de Actividades</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" /> Crear Actividad
          </button>
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              {['TÍTULO', 'DESCRIPCIÓN', 'IMAGEN', 'ACCIONES'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredActivities.map((activity: Activity) => (
              <tr key={activity.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {activity.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {activity.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activity.imagenUrl ? (
                    <Image 
                      src={activity.imagenUrl} 
                      alt={activity.title} 
                      width={40}
                      height={40}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => {
                        // Lógica de edición
                        console.log('Editar actividad', activity.id);
                      }}
                      className="hover:text-white"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-gray-800 rounded-xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Crear Nueva Actividad</h2>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hora</label>
                <input
                  type="time"
                  value={newActivity.hour}
                  onChange={(e) => setNewActivity({...newActivity, hour: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Máximo de Personas</label>
                <input
                  type="number"
                  value={newActivity.maxPeople}
                  onChange={(e) => setNewActivity({...newActivity, maxPeople: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL de Imagen</label>
                <input
                  type="text"
                  value={newActivity.imagenUrl}
                  onChange={(e) => setNewActivity({...newActivity, imagenUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}