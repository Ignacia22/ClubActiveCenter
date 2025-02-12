'use client';

import { useState } from 'react';
import { IProducts } from '@/interface/IProducts';
import { Edit, Trash2, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface ProductsTableProps {
  products: IProducts[];
  totalProducts: number;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onCreateClick: () => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onDelete,
  onEdit,
  onCreateClick,
  onPageChange,
  currentPage,
  totalPages
}) => {
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
      
      if (confirmDelete) {
        setIsDeletingId(id);
        await onDelete(id);
        alert('Producto eliminado con éxito');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const formatPrice = (price: number | string | undefined): string => {
    if (typeof price === 'undefined') return '$0.00';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '$0.00';
    return `$${numericPrice.toFixed(2)}`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Lista de Productos</h2>
        <button 
          onClick={onCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" /> Crear Producto
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-fixed">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Descripción</th>
              <th className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Precio</th>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">Stock</th>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">Imagen</th>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product) => (
              <tr 
                key={product.id} 
                className={`hover:bg-gray-700/50 ${isDeletingId === product.id ? 'opacity-50' : ''}`}
              >
                <td className="px-6 py-4 text-sm text-gray-300">
                  <div className="font-medium text-white mb-1">{product.name}</div>
                  <div className="text-gray-400">{product.description}</div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-300 whitespace-nowrap">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-300 whitespace-nowrap">
                  {product.stock || 0}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {product.file ? (
                      <Image 
                        src={URL.createObjectURL(product.file)}
                        alt={product.name} 
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : product.image ? (
                      <Image 
                        src={product.image}
                        alt={product.name} 
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">Sin imagen</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div className="flex justify-center space-x-3">
                    <button 
                      onClick={() => onEdit(product.id)}
                      className="hover:text-white transition-colors p-1 rounded hover:bg-gray-600"
                      disabled={isDeletingId === product.id}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-gray-600"
                      disabled={isDeletingId === product.id}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center items-center space-x-4 p-4 bg-gray-900/50">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-700 text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-white">
            Página {currentPage} de {totalPages}
          </span>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-700 text-white disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};