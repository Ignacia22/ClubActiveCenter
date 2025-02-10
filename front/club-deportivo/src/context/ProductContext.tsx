"use client";

import { createContext, useState, useContext } from "react";
import { IProducts } from "@/interface/IProducts"; // Asegúrate de tener la interfaz de producto

// Definición del tipo de contexto
interface ProductContextProps {
  products: IProducts[];
  addProduct: (product: Omit<IProducts, "id">) => void;
  removeProduct: (id: string) => void;
  editProduct: (id: string, updatedProduct: Omit<IProducts, "id">) => void; // Función de edición
}

const ProductContext = createContext<ProductContextProps>({
  products: [],
  addProduct: () => {},
  removeProduct: () => {},
  editProduct: () => {}, // Inicializamos la función de edición
});

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<IProducts[]>([]);

  // Agregar producto
  const addProductHandler = (product: Omit<IProducts, "id">) => {
    try {
      const newProduct: IProducts = { ...product, id: Date.now().toString() }; // Generamos un id único para el producto
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Eliminar producto
  const removeProductHandler = (id: string) => {
    try {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Editar producto
  const editProductHandler = (
    id: string,
    updatedProduct: Omit<IProducts, "id">
  ) => {
    try {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct: addProductHandler,
        removeProduct: removeProductHandler,
        editProduct: editProductHandler, // Proveemos la función de edición
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de un ProductProvider");
  }
  return context;
};
