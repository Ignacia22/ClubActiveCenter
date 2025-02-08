/* eslint-disable @typescript-eslint/no-unused-vars */
import { useActivities } from '@/context/ActivityContext2';
import { useAuth } from '@/context/AuthContext';

import { useCart } from '@/context/CartContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
    </div>
  );
}

export default function StatsCards() {
  const { activities } = useActivities();
  const { user } = useAuth();
  const { items, getCartTotal } = useCart();

  const stats = {
    totalActivities: activities.length,
    activeActivities: activities.filter(a => a.status === 'active').length,
    totalOrders: items.length,
    totalRevenue: getCartTotal().toFixed(2)
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatsCard 
        title="Total Actividades" 
        value={stats.totalActivities} 
      />
      <StatsCard 
        title="Actividades Activas" 
        value={stats.activeActivities} 
      />
      <StatsCard 
        title="Total Órdenes" 
        value={stats.totalOrders}
      />
      <StatsCard 
        title="Ingresos Totales" 
        value={`$${stats.totalRevenue}`}
        description="Últimos 30 días"
      />
    </div>
  );
}