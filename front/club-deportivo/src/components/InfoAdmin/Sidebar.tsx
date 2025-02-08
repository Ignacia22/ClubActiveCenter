"use client"

import { Home, Table, Users, CreditCard, Settings, User, LogIn } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-black text-white p-4 fixed left-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Centro Deportivo</h1>
      </div>
      
      <nav className="space-y-2">
        <a href="/admin/adminDashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </a>
        <a href="/admin/usuarios" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
          <Users className="h-5 w-5" />
          <span>Usuarios</span>
        </a>
        <a href="/admin/actividades" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
          <Table className="h-5 w-5" />
          <span>Actividades</span>
        </a>
        <a href="/admin/productos" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
          <Table className="h-5 w-5" />
          <span>Productos</span>
        </a>
        <a href="/billing" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
          <CreditCard className="h-5 w-5" />
          <span>Facturación</span>
        </a>
        <a href="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </a>
      </nav>

      <div className="mt-8">
        <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase">Cuenta</h2>
        <nav className="mt-2 space-y-2">
          <a href="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </a>
          <button onClick={() => console.log('Cerrar sesión')} className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600/20">
            <LogIn className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-600/10 rounded-lg p-4">
          <h3 className="text-sm font-semibold">¿Necesitas ayuda?</h3>
          <p className="text-xs text-gray-400 mt-1">Consulta nuestra documentación</p>
          <button 
            className="mt-3 w-full bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={() => console.log('Abrir documentación')}
          >
            Documentación
          </button>
        </div>
      </div>
    </div>
  );
}