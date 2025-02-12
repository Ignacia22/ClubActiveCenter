
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import { IUser } from '@/interface/IUser';
import { useAdmin } from '@/context/AdminContext';

export interface UsersTableProps {
 searchTerm: string;
}

export enum UserStatus {
 ACTIVE = 'Conect',
 BANNED = 'Banned',
 SUSPENDED = 'Disconnected',
 DELETED = 'Elimined'
}

export default function UsersTable({ searchTerm }: UsersTableProps) {
 const { getAllUsers, isBan } = useAdmin();
 const [users, setUsers] = useState<IUser[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    const data = await getAllUsers();
    
    console.log('Datos recibidos:', data);

    const usersWithVerifiedStatus = data.map(user => ({
      ...user,
      // Mapeo explícito de estados
      userStatus: user.userStatus === 'Conect' 
        ? UserStatus.ACTIVE 
        : user.userStatus === 'Banned'
          ? UserStatus.BANNED
          : user.userStatus === 'Disconnected'
            ? UserStatus.SUSPENDED
            : user.userStatus === 'Elimined'
              ? UserStatus.DELETED
              : UserStatus.ACTIVE,
      userInfo: {
        ...user.userInfo,
        userStatus: (user.userStatus === 'Conect' 
          ? UserStatus.ACTIVE 
          : user.userStatus === 'Banned'
            ? UserStatus.BANNED
            : user.userStatus === 'Disconnected'
              ? UserStatus.SUSPENDED
              : user.userStatus === 'Elimined'
                ? UserStatus.DELETED
                : UserStatus.ACTIVE).toString()
      }
    })) as IUser[];

    setUsers(usersWithVerifiedStatus);
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    setError('Error al cargar usuarios');
  } finally {
    setLoading(false);
  }
 }, []); 

 useEffect(() => {
  fetchUsers();

  return () => {
    setUsers([]);
    setLoading(false);
    setError('');
  };
 }, []); 

 const filteredUsers = users.filter(user => 
   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.dni.toString().includes(searchTerm)
 );

 const handleStatusChange = useCallback(async (user: IUser) => {
  try {
    const userId = user.id;

    if (!userId) {
      console.error('No se encontró el ID del usuario');
      return;
    }

    console.log('Cambiando estado para usuario:', user);

    const response = await isBan(userId);
    console.log('Respuesta completa de isBan:', response);

    // Verificación de existencia del mensaje
    const message = response?.message || '';
    
    setUsers(prevUsers => 
      prevUsers.map(prevUser => 
        prevUser.id === userId 
          ? {
              ...prevUser,
              userStatus: message.includes('desbaneado') 
                ? UserStatus.ACTIVE 
                : message.includes('baneado')
                  ? UserStatus.BANNED
                  : prevUser.userStatus,
              userInfo: {
                ...prevUser.userInfo,
                userStatus: (message.includes('desbaneado') 
                  ? UserStatus.ACTIVE 
                  : message.includes('baneado')
                    ? UserStatus.BANNED
                    : prevUser.userStatus).toString()
              }
            }
          : prevUser
      )
    );
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    // Opcional: mostrar un mensaje de error al usuario
  }
}, [isBan]);

 const getStatusBadgeStyle = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case UserStatus.SUSPENDED:
      return 'bg-yellow-100 text-yellow-800';
    case UserStatus.BANNED:
      return 'bg-red-100 text-red-800';
    case UserStatus.DELETED:
      return 'bg-gray-100 text-gray-500 line-through';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusButtonText = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Suspender';
    case UserStatus.SUSPENDED:
      return 'Banear';
    case UserStatus.BANNED:
      return 'Activar';
    case UserStatus.DELETED:
      return 'Eliminado';
    default:
      return 'Cambiar Estado';
  }
};

const getStatusButtonColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'text-yellow-400 hover:text-yellow-300';
    case UserStatus.SUSPENDED:
      return 'text-red-400 hover:text-red-300';
    case UserStatus.BANNED:
      return 'text-green-400 hover:text-green-300';
    case UserStatus.DELETED:
      return 'text-gray-400 cursor-not-allowed';
    default:
      return 'text-gray-400 hover:text-white';
  }
};

 if (loading) return <div className="text-white">Cargando usuarios...</div>;
 if (error) return <div className="text-red-500">{error}</div>;
 if (users.length === 0) return <div className="text-white">No hay usuarios</div>;

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
               <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeStyle(user.userStatus)}`}>
                 {user.userStatus === UserStatus.ACTIVE 
                   ? 'Activo' 
                   : user.userStatus === UserStatus.SUSPENDED 
                     ? 'Suspendido'
                     : user.userStatus === UserStatus.BANNED
                       ? 'Baneado'
                       : 'Eliminado'}
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
                   onClick={() => handleStatusChange(user)}
                   className={`hover:text-white ${getStatusButtonColor(user.userStatus)}`}
                 >
                   {getStatusButtonText(user.userStatus)}
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