/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { ProductState, IProducts } from "@/interface/IProducts";
import { useEffect, useState } from "react";

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
      {description && (
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
}

export default function StatsProducts() {
  const { user } = useAuth();
  const { getAllProducts } = useAdmin();
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    outOfStockProducts: 0,
    totalRevenue: '0.00'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const result = await getAllProducts(1); // Obtener todos los productos
        const products = result.products;
        
        const calculatedStats = {
          totalProducts: products.length,
          availableProducts: products.filter(
            (product: IProducts) => product.State === ProductState.Disponible
          ).length,
          outOfStockProducts: products.filter(
            (product: IProducts) => product.State === ProductState.SinStock
          ).length,
          totalRevenue: products
            .reduce((total: number, product: IProducts) => total + product.price * product.stock, 0)
            .toFixed(2)
        };

        setStats(calculatedStats);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductStats();
  }, []); // Se ejecuta solo al montar el componente

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((index) => (
        <div key={`loading-stats-${index}`} className="bg-gray-800 rounded-lg p-4 animate-pulse">
         <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
         <div className="h-6 bg-gray-700 rounded w-1/2"></div>
       </div>
))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatsCard 
        title="Total Productos" 
        value={stats.totalProducts} 
      />
      <StatsCard
        title="Productos Disponibles"
        value={stats.availableProducts}
      />
      <StatsCard 
        title="Productos Sin Stock" 
        value={stats.outOfStockProducts} 
      />
      <StatsCard
        title="Ingresos Totales"
        value={`$${stats.totalRevenue}`}
        description="Basado en el precio y el stock de los productos"
      />
    </div>
  );
}