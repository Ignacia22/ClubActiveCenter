/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { IUser } from '@/interface/IUser';
import { useAdmin } from '@/context/AdminContext';
import { debounce } from 'lodash';

export interface UsersTableProps {
  searchTerm: string;
}

// Enum para los estados de usuario
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  SUSPENDED = 'SUSPENDED'
}

export default function UsersTable({ searchTerm }: UsersTableProps) {
  const { getAllUsers, isBan } = useAdmin();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        const usersWithVerifiedStatus = await Promise.all(
          data.map(async (user) => {
            try {
              const isBanned = await isBan(user.id);
              return {
                ...user,
                userStatus: isBanned ? UserStatus.BANNED : (user.userStatus || UserStatus.ACTIVE)
              };
            } catch (banError) {
              console.error(`Error verificando ban para usuario ${user.id}:`, banError);
              return user;
            }
          })
        );
        setUsers(usersWithVerifiedStatus);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
  
    const debouncedFetch = debounce(fetchUsers, 300);
    debouncedFetch();
  
    return () => debouncedFetch.cancel();
  }, []);

  // Debugging adicional
  console.log('Estado de usuarios:', { users, loading, error });

  if (loading) return <div className="text-white">Cargando usuarios...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (users.length === 0) return <div className="text-white">No hay usuarios</div>;

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dni.toString().includes(searchTerm)
  );

  const handleBanUser = async (userId: string) => {
    try {
      await isBan(userId);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
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
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.userStatus === UserStatus.ACTIVE
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.userStatus === UserStatus.ACTIVE ? 'Activo' : 'Suspendido'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {user.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {user.activities?.length || 0} actividades
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleBanUser(user.id)}
                    className="hover:text-white"
                  >
                    {user.userStatus === UserStatus.ACTIVE ? 'Suspender' : 'Activar'}
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
  );
}