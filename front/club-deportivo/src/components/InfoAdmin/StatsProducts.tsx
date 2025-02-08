/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext"; // Asumiendo que usas este contexto para productos
import { ProductState, IProducts } from "@/interface/IProducts"; // Importar tu interfaz y enum

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
  const { products } = useProducts();

  // Cálculos para las estadísticas
  const stats = {
    totalProducts: products.length,
    availableProducts: products.filter(
      (product) => product.State === ProductState.Disponible
    ).length,
    outOfStockProducts: products.filter(
      (product) => product.State === ProductState.SinStock
    ).length,
    totalRevenue: products
      .reduce((total, product) => total + product.price * product.stock, 0)
      .toFixed(2), // Ingreso total calculado con stock
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatsCard title="Total Productos" value={stats.totalProducts} />
      <StatsCard
        title="Productos Disponibles"
        value={stats.availableProducts}
      />
      <StatsCard title="Productos Sin Stock" value={stats.outOfStockProducts} />
      <StatsCard
        title="Ingresos Totales"
        value={`$${stats.totalRevenue}`}
        description="Basado en el precio y el stock de los productos"
      />
    </div>
  );
}
