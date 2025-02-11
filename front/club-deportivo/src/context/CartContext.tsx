/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { IProducts, ProductState } from "@/interface/IProducts";
import { createContext, useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { IUser } from "@/interface/IUser";

// Validar variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

if (!API_URL) {
  throw new Error(
    "La variable de entorno NEXT_PUBLIC_API_URL no está definida"
  );
}

if (!STRIPE_KEY) {
  throw new Error(
    "La variable de entorno NEXT_PUBLIC_STRIPE_PUBLIC_KEY no está definida"
  );
}

// Inicializar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Función dummy para promesas por defecto
const dummyPromise = async (): Promise<void> => Promise.resolve();

interface CartItem extends IProducts {
  quantity: number;
  productPrice?: number | string;
}

interface CartContextProps {
  items: CartItem[];
  addItemToCart: (item: IProducts) => Promise<void>; // Ahora es async
  removeItemFromCart: (id: string) => Promise<void>; // Ahora es async
  updateItemQuantity: (id: string, delta: number) => Promise<void>; // Ahora es async
  emptyCart: () => void;
  countItems: (id: string) => number;
  getCartTotal: () => number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  processPayment: () => Promise<void>;
  isProcessingPayment: boolean;
}

const CartContext = createContext<CartContextProps>({
  items: [],
  addItemToCart: async () => {},
  removeItemFromCart: async () => {},
  updateItemQuantity: async () => {},
  emptyCart: async () => {},
  countItems: () => 0,
  getCartTotal: () => 0,
  itemCount: 0,
  isOpen: false,
  setIsOpen: () => {},
  processPayment: dummyPromise,
  isProcessingPayment: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Cargar carrito al iniciar
  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");

        if (!token || !userJson) {
          throw new Error(
            "No se encontró token de autenticación o datos de usuario"
          );
        }

        // Parsear datos de usuario
        let user: IUser;
        try {
          user = JSON.parse(userJson);
        } catch (e) {
          throw new Error("Error al procesar datos de usuario");
        }

        const userId = user.userInfo?.id;
        if (!userId) {
          throw new Error("No se encontró ID de usuario");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          const cartItems = Array.isArray(response.data) ? response.data : [];
          setItems(cartItems);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setItems([]);
      }
    };

    loadCart();
  }, []);

  const addItemToCart = async (item: IProducts): Promise<void> => {
    try {
      // 1. Validar estado del producto
      if (item.State !== ProductState.Disponible) {
        throw new Error("Producto no disponible");
      }

      // 2. Obtener credenciales
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) {
        throw new Error("Necesitas iniciar sesión");
      }

      const user: IUser = JSON.parse(userData);
      const userId = user?.userInfo?.id;
      if (!userId) {
        throw new Error("Usuario inválido");
      }

      // 3. Preparar la URL y el payload
      const url = `${API_URL}/cart/add`;
      const payload = {
        userId,
        products: [{ productId: item.id, quantity: 1 }],
      };

      // 4. Realizar la petición con manejo de errores
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // 5. Actualizar el estado local solo si la petición fue exitosa
      setItems((currentItems) => {
        return currentItems
          .map((i) =>
            i.id === item.id && i.quantity < item.stock
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
          .concat(
            currentItems.some((i) => i.id === item.id)
              ? []
              : [{ ...item, quantity: 1 }]
          );
      });

      setIsOpen(true);
    } catch (error: any) {
      // 6. Manejo de errores más robusto
      let errorMessage = "Error al agregar producto al carrito";
      if (error.response?.status === 500) {
        errorMessage = "Error interno del servidor. Intenta más tarde.";
      }
      throw new Error(errorMessage);
    }
  };

  const removeItemFromCart = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const user: IUser | any = localStorage.getItem("user");
      const userId: string = user.userInfo.id;
      if (!token || !userId) throw new Error("No authentication token found");

      // Ruta corregida a /cart/remove
      await axios.delete(`${API_URL}/cart/remove`, {
        data: { userId, productId: id },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  };

  const updateItemQuantity = async (id: string, delta: number) => {
    try {
      const token = localStorage.getItem("token");
      const user: IUser | any = localStorage.getItem("user");
      const userId: string = user.userInfo.id;
      if (!token || !userId) throw new Error("No authentication token found");

      const item = items.find((item) => item.id === id);
      if (!item) throw new Error("Item not found");

      // Calcular nueva cantidad y validar
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        // Si la nueva cantidad es 0 o menor, eliminar el item
        return removeItemFromCart(id);
      }

      await axios.put(
        `${API_URL}/cart/update`,
        {
          userId,
          productId: id,
          quantity: newQuantity, // Aseguramos que siempre sea > 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setItems((currentItems) => {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      throw error;
    }
  };

  const processPayment = async () => {
    if (items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // Verificar si hay productos no disponibles
    const unavailableItems = items.filter(
      (item) => item.State !== ProductState.Disponible
    );
    if (unavailableItems.length > 0) {
      throw new Error("Hay productos no disponibles en el carrito");
    }

    setIsProcessingPayment(true);

    try {
      // Obtener token y datos de usuario
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");

      if (!token || !userJson) {
        throw new Error(
          "No se encontró token de autenticación o datos de usuario"
        );
      }

      // Parsear datos de usuario
      let user: IUser;
      try {
        user = JSON.parse(userJson);
      } catch (e) {
        throw new Error("Error al procesar datos de usuario");
      }

      const userId = user.userInfo?.id;
      if (!userId) {
        throw new Error("No se encontró ID de usuario");
      }

      // Verificar stock antes de procesar
      const itemsWithInsufficientStock = items.filter(
        (item) => item.quantity > item.stock
      );
      if (itemsWithInsufficientStock.length > 0) {
        throw new Error("Algunos productos exceden el stock disponible");
      }

      // Log de verificación
      console.log("Items antes de pagar:", items);
      items.forEach((item) => {
        console.log("Detalle de item:", {
          id: item.id,
          price: item.price,
          productPrice: item.productPrice,
          quantity: item.quantity,
          state: item.State,
        });
      });

      // Realizar petición al API
      const response = await axios.post(
        `${API_URL}/order/${userId}/convert-cart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Verificar y procesar respuesta
      if (response.data?.checkoutUrl) {
        emptyCart();
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("No se recibió la URL de checkout");
      }
    } catch (error: any) {
      console.error("Error al procesar pago:", {
        mensaje: error.message,
        respuesta: error.response?.data,
        detalles: error.response?.data?.details,
      });

      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  };

  const emptyCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const countItems = (id: string) =>
    items.find((item) => item.id === id)?.quantity || 0;
  const getCartTotal = () =>
    items.reduce((total, item) => {
      // Intenta obtener el precio, primero de 'price', luego de 'productPrice'
      const price = item.price ?? item.productPrice;
      const numericPrice =
        typeof price === "string" ? parseFloat(price) : price;
      return total + numericPrice * item.quantity;
    }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        processPayment,
        isProcessingPayment,
        emptyCart,
        countItems,
        getCartTotal,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
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
