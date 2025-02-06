/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import StatsCards from './StatsCards';
import UsersTable from './UsersTable';
import OrdersTable from './OrdersTable';

export default function UsersContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAdmin } = useAuth();

  if (!isAdmin) {
    return <div className="text-red-500">Acceso no autorizado</div>;
  }

  return (
    <div className="p-8">
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

      {/* Stats */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Users Table */}
        <UsersTable searchTerm={searchTerm} />

        {/* Orders Table */}
        <OrdersTable />
      </div>
    </div>
  );
}