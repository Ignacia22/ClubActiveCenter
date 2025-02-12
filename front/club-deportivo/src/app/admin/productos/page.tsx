/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import {  CreateProductDto, ProductState } from '@/interface/IProducts';
import { ProductsTable } from '@/components/admin/ProductsTable';
import StatsCard from '@/components/InfoAdmin/StatsCard';
import { CreateProductModal } from '@/components/admin/CreateProductModal';

export default function ProductsPage() {
  const { 
    products, 
    loading,
    error,
    totalPages,
    getAllProducts, 
    createProduct, 
    deleteProduct,
    updateProduct,
    getProductById,
  } = useAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [newProduct, setNewProduct] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    category: '',
    State: ProductState.Disponible
  });

  // Ordenar productos por ID (asumiendo que IDs más recientes son "mayores")
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.id.localeCompare(a.id);
    }
    return a.id.localeCompare(b.id);
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      await getAllProducts(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading || isLoading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setIsCreateModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        category: '',
        State: ProductState.Disponible
      });
      fetchProducts(); // Recargar productos después de crear
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('No se pudo crear el producto. Por favor, inténtalo de nuevo.');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentProductId) return;
    
    try {
      await updateProduct(currentProductId, newProduct);
      setIsEditModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        category: '',
        State: ProductState.Disponible
      });
      setCurrentProductId(null);
      fetchProducts(); // Recargar productos después de actualizar
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('No se pudo actualizar el producto. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts(); // Recargar productos después de eliminar
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
    }
  };

  const handleEditProduct = async (id: string) => {
    try {
      const product = await getProductById(id);
      if (product) {
        setNewProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image: product.image || '',
          category: product.category,
          State: product.State || ProductState.Disponible
        });
        setCurrentProductId(id);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      alert('No se pudo obtener el producto. Por favor, inténtalo de nuevo.');
    }
  };

  const filteredProducts = sortedProducts.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-400 text-sm">/ Productos</div>
          <h1 className="text-2xl font-bold text-white">Gestión de Productos</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Más recientes primero</option>
            <option value="asc">Más antiguos primero</option>
          </select>

          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-4 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatsCard 
          title="Total Productos" 
          value={products.length} 
        />
      </div>

      <ProductsTable 
        products={filteredProducts}
        totalProducts={filteredProducts.length}
        onDelete={handleDeleteProduct}
        onEdit={handleEditProduct}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {isCreateModalOpen && (
        <CreateProductModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProduct}
          product={newProduct}
          setProduct={setNewProduct}
        />
      )}

      {isEditModalOpen && (
        <CreateProductModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateProduct}
          product={newProduct}
          setProduct={setNewProduct}
          isEditing={true}
        />
      )}
    </div>
  );
}