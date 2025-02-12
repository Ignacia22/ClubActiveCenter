'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical } from 'lucide-react';

import { useAdmin } from '@/context/AdminContext';
import Sidebar from '@/components/InfoAdmin/Sidebar';
import { UserStatus } from '@/components/InfoAdmin/UsersTable';

export default function UsersDashboard() {
  const { 
    users, 
    loading, 
    error, 
    getAllUsers,  
    isBan,        
  } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (users.length === 0) {
          await getAllUsers();
        }
      } catch (fetchError) {
        console.error('Error al cargar usuarios:', fetchError);
      }
    };

    fetchUsers();
  }, [getAllUsers, users.length]);

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspendUser = async (userId: string) => {
    try {
      await isBan(userId);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-gray-400">/ Usuarios</div>
            <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">Total Usuarios</h3>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">Usuarios Activos</h3>
            <p className="text-2xl font-bold text-white">
              {users.filter(u => u.userStatus === UserStatus.ACTIVE).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">Administradores</h3>
            <p className="text-2xl font-bold text-white">
              {users.filter(u => u.isAdmin).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">Nuevos este mes</h3>
            <p className="text-2xl font-bold text-white">
              {users.filter(u => {
                const userDate = u.createUser ? new Date(u.createUser) : null;
                const now = new Date();
                return userDate && 
                  userDate.getMonth() === now.getMonth() && 
                  userDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Lista de Usuarios</h2>
            
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Actividades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.userStatus === UserStatus.ACTIVE 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.userStatus === UserStatus.ACTIVE 
                        ? 'Activo' 
                        : 'Baneado'}
                    </span>
                  </td>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.activities?.length || 0} actividades
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex space-x-3">
                      <button className="hover:text-white">Editar</button>
                      <button 
                       onClick={() => handleSuspendUser(user.id)}
                        className="hover:text-white"
                      >
                        {user.userStatus === UserStatus.ACTIVE 
                          ? 'Banear' 
                          : 'Activar'}
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}