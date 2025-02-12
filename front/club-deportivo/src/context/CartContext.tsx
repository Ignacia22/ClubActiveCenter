"use client";

import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { IProducts, ProductState } from "@/interface/IProducts";
import { IUser } from "@/interface/IUser";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


interface CartItem extends IProducts {
  quantity: number;
  productPrice?: number | string;
}

interface CartContextProps {
  items: CartItem[];
  addItemToCart: (item: IProducts) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (id: string) => Promise<void>;
  countItems: (id: string) => number;
  getCartTotal: () => number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  processPayment: () => Promise<void>;
  isProcessingPayment: boolean;
}
type CartType = {
  items: { id: string; name: string; price: number }[]; // Ejemplo de un producto
  total: number;
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cart, setCart] = useState<CartType>(/* Initial state */);

  console.log("CartContext value:", { cart, setCart }); 

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        if (!token || !userJson) return;

        const user: IUser = JSON.parse(userJson);
        const userId = user.userInfo?.id;
        if (!userId) return;

        const response = await axios.get(`${API_URL}/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        setItems(response.data.items || []);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart().catch(console.error);
  }, []);

  const addItemToCart = useCallback(async (item: IProducts) => {
    try {
      if (item.State !== ProductState.Disponible) throw new Error("Producto no disponible");

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) throw new Error("Necesitas iniciar sesión");

      const user: IUser = JSON.parse(userData);
      const userId = user?.userInfo?.id;
      if (!userId) throw new Error("Usuario inválido");

      await axios.post(`${API_URL}/cart/add`, { userId, products: [{ productId: item.id, quantity: 1 }] }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setItems((currentItems) => {
        return currentItems.some((i) => i.id === item.id)
          ? currentItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...currentItems, { ...item, quantity: 1 }];
      });
      setIsOpen(true);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }, []);

  const updateItemQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      if (quantity < 0) throw new Error("La cantidad no puede ser negativa");

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) throw new Error("No authentication token found");

      const user: IUser = JSON.parse(userData);
      const userId = user?.userInfo?.id;
      if (!userId) throw new Error("User not found");

      await axios.put(`${API_URL}/cart/update`, { userId, productId, quantity }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setItems((currentItems) =>
        currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  }, []);

  const removeItemFromCart = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");
      if (!token || !userJson) throw new Error("No authentication token found");

      const user: IUser = JSON.parse(userJson);
      const userId = user.userInfo?.id;

      await axios.delete(`${API_URL}/cart/remove`, {
        data: { userId, productId: id },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  }, []);

  const processPayment = async () => {
    if (!items.length) {
      alert("El carrito está vacío"); // O alguna otra forma de mostrar el error
      return;
    }
  
    setIsProcessingPayment(true); // Activamos el estado de procesamiento de pago
  
    try {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");
      if (!token || !userJson) throw new Error("No se encontró token de autenticación o datos de usuario");
  
      const user: IUser = JSON.parse(userJson);
      const userId = user.userInfo?.id;
      if (!userId) throw new Error("No se encontró ID de usuario");


  
      const response = await axios.post(
        `${API_URL}/order/${userId}/convert-cart`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      // Verificamos si la URL de pago es válida
      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl; // Redirigimos al usuario al checkout
      } else {
        throw new Error("No se recibió la URL de checkout");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Hubo un error al procesar el pago, por favor intente nuevamente.");
    } finally {
      setIsProcessingPayment(false); // Desactivamos el estado de procesamiento de pago
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addItemToCart,
      updateItemQuantity,
      removeItemFromCart,
      processPayment,
      isProcessingPayment,
      countItems: (id) => items.find((i) => i.id === id)?.quantity || 0,
      getCartTotal: () => items.reduce((total, item) => total + (Number(item.productPrice || item.price) * item.quantity), 0),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
