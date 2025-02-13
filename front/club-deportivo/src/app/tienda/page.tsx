/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import Card from "../../components/Card/Card";

export default function Tienda() {
  const { products, getAllProducts, totalPages, currentPage } = useAdmin();

  // Usar currentPage del contexto en lugar de un estado local separado
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Activa el estado de carga antes de la petición
      try {
        await getAllProducts(page);
      } catch (error) {
        alert("Error al obtener los productos");
      } finally {
        setLoading(false); // Desactiva el estado de carga después de la petición
      }
    };

    fetchProducts();
  }, [page]);

  // 🔥 Si la página está cargando, muestra solo el mensaje de carga
  if (loading)
    return (
      <div className="text-white text-2xl text-center py-20">Cargando...</div>
    );

  // Función para generar los números de página (sin cambios)
  const generatePageNumbers = () => {
    const pageNumbers = [];

    // Mostrar primeras 3 páginas
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pageNumbers.push(i);
    }

    // Añadir puntos suspensivos si hay más de 3 páginas
    if (totalPages > 3 && currentPage > 3) {
      pageNumbers.push(-1); // Usar -1 como indicador de puntos suspensivos
    }

    // Añadir páginas cercanas a la página actual
    if (totalPages > 3) {
      const startPage = Math.max(4, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }
    }

    // Añadir última página si es necesario
    if (totalPages > 3 && !pageNumbers.includes(totalPages)) {
      if (currentPage < totalPages - 2) {
        pageNumbers.push(-1); // Puntos suspensivos
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Función para cambiar página que actualiza tanto el estado local como el contexto
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="bg-black text-white">
        <header className="text-center py-8">
          <h1 className="text-3xl md:text-[3rem] font-sans font-bold drop-shadow-lg">
            Tienda de Productos
          </h1>
          <p className="text-gray-400 mt-4 text-xl">
            Encuentra los mejores productos aquí. ¡Compra ahora!
          </p>
        </header>
      </div>
      <div className="bg-black w-full max-w-7xl mx-auto h-full">
        <div className="bg-black grid items-center gap-8 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>

        {/* Componente de Paginación */}
        <div className="flex justify-center items-center space-x-2 mt-8 bg-black py-4">
          {/* Botón de página anterior */}
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-800 text-gray-400 rounded disabled:opacity-50"
          >
            &lt;
          </button>

          {generatePageNumbers().map((pageNum) =>
            pageNum === -1 ? (
              <span key="ellipsis" className="px-3 py-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          {/* Botón de página siguiente */}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-800 text-gray-400 rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
