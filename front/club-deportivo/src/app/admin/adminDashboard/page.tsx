/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { UserStatus } from '@/components/InfoAdmin/UsersTable';
import Image from 'next/image';

export default function AdminDashboard() {
  const { 
    users, 
    activities,
    products,
    loading, 
    error, 
    getAllUsers,
    getAllActivities,
    getAllProducts,
  } = useAdmin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllUsers(),
          getAllActivities(),
          getAllProducts(),
        ]);
      } catch (fetchError) {
        console.error('Error al cargar datos:', fetchError);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const activeUsers = users.filter(u => u.userStatus === UserStatus.ACTIVE).length;
  const adminUsers = users.filter(u => u.isAdmin).length;
  const newUsersThisMonth = users.filter(u => {
    const userDate = u.createUser ? new Date(u.createUser) : null;
    const now = new Date();
    return userDate && 
      userDate.getMonth() === now.getMonth() && 
      userDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { name: 'Total Usuarios', value: users.length },
    { name: 'Usuarios Activos', value: activeUsers },
    { name: 'Administradores', value: adminUsers },
    { name: 'Nuevos este mes', value: newUsersThisMonth },
    { name: 'Total Actividades', value: activities.length },
    { name: 'Total Productos', value: products.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-gray-400 text-sm">/ Dashboard</div>
        <h1 className="text-2xl font-bold text-white">Estadísticas Generales</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm">{stat.name}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-4">Resumen General</h2>
            <div className="space-y-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{stat.name}</span>
                  <div className="w-1/2 bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{width: `${(stat.value / Math.max(...stats.map(s => s.value))) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
          <Image 
            src="https://res.cloudinary.com/dqiehommi/image/upload/v1739393865/pexels-maksgelatin-4348638_glfjci.jpg" 
            alt="Dashboard Illustration" 
            className="max-w-full h-auto rounded-lg"
            width={1100}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}