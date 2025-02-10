"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { IProducts, CreateProductDto } from "@/interface/IProducts";
import Image from "next/image";

export default function ProductDashboard() {
  const {
    products,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const ProductsList: IProducts[] = Array.isArray(products) ? products : [];

  const [newProduct, setNewProduct] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (hasLoaded) return;
      try {
        await getAllProducts();
        setHasLoaded(true);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };

    fetchProducts();
  }, [getAllProducts, hasLoaded]);

  // Verifica si los datos están cargando o hay error
  if (!hasLoaded) {
    return <div className="text-white">Cargando...</div>;
  }

  // Filtrar productos
  const filteredActivities: IProducts[] = ProductsList.filter(
    (product: IProducts) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!newProduct.name.trim()) {
      alert("El título es obligatorio");
      return;
    }

    if (!newProduct.description.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    if (newProduct.price <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    try {
      console.log("Creando producto:", newProduct);
      const result = await createProduct(newProduct);
      console.log("Resultado de crear producto:", result);

      setIsCreateModalOpen(false);
      // Resetear el formulario
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("No se pudo crear el producto. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Editar producto: obtener el producto por ID y abrir el modal de edición
  const handleEditActivity = async (id: string) => {
    try {
      const product = await getProductById(id); // Obtener los detalles del producto
      if (product) {
        setNewProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image: product.image || "",
        });
        setCurrentProductId(id);
        setIsEditModalOpen(true); // Abrir el modal de edición
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      alert("No se pudo obtener el producto. Por favor, inténtalo de nuevo.");
    }
  };

  const handleUpdateActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!newProduct.name.trim()) {
      alert("El título es obligatorio");
      return;
    }

    if (!newProduct.description.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    if (newProduct.price <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    try {
      console.log("Actualizando producto:", newProduct);
      if (currentProductId) {
        const result = await updateProduct(currentProductId, newProduct);
        console.log("Resultado de actualizar producto:", result);

        setIsEditModalOpen(false);
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          image: "",
        });
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert(
        "No se pudo actualizar el producto. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Depuración */}
      <div className="bg-gray-800 rounded-lg p-4 text-white">
        <h3>Depuración de productos</h3>
        <pre>{JSON.stringify(products, null, 2)}</pre>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-400 text-sm">/ Productos</div>
          <h1 className="text-2xl font-bold text-white">
            Gestión de Productos
          </h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar Producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-4 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Total de Productos</h3>
          <p className="text-2xl font-bold text-white">{ProductsList.length}</p>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Lista de Productos</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" /> Crear Producto
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              {["TÍTULO", "DESCRIPCIÓN", "IMAGEN", "ACCIONES"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredActivities.map((product: IProducts) => (
              <tr key={product.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.image ? (
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        handleEditActivity(product.id)
                      } /* Abrir modal para editar */
                      className="hover:text-white"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Producto */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateModalOpen(false);
            }
          }}
        >
          <div
            className="bg-gray-800 rounded-xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Crear Nueva Producto
            </h2>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: +e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: +e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen
                </label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Producto */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <div
            className="bg-gray-800 rounded-xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Editar Producto
            </h2>
            <form onSubmit={handleUpdateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: +e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: +e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen
                </label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
