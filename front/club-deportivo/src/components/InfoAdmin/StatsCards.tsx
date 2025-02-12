/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useCart } from '@/context/CartContext';
import { Activity2 } from '@/interface/IActivity2';
import StatsCard from './StatsCard'; 

export default function StatsCards() {
  const [activities, setActivities] = useState<Activity2[]>([]);
  const { getAllActivities } = useAdmin();
  const { items, getCartTotal } = useCart();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await getAllActivities();
        const convertedActivities: Activity2[] = activitiesData.map(activity => ({
          ...activity,
          img: '',
          registeredPeople: 0,
          status: 'active'
        }));
        setActivities(convertedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

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