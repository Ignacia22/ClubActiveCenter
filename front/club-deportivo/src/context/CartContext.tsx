/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import axios from 'axios';
import { IProducts, ProductState } from "@/interface/IProducts";
import { createContext, useContext, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';

// Validar variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

if (!API_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida');
}

if (!STRIPE_KEY) {
  throw new Error('La variable de entorno NEXT_PUBLIC_STRIPE_PUBLIC_KEY no está definida');
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
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        // Log de verificación inicial
        console.log('Verificando credenciales:', {
          token: token ? 'Presente' : 'Ausente',
          userId,
          API_URL
        });
  
        if (!token || !userId) {
          console.log('⛔ Falta token o userId');
          setItems([]);
          return;
        }
  
        // Intenta obtener el carrito
        try {
          const getCartUrl = `${API_URL}/cart/${userId}`;
          console.log('🛒 Intentando obtener carrito:', getCartUrl);
  
          const response = await axios.get(getCartUrl, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          console.log('✅ Carrito obtenido:', response.data);
  
          if (response.data) {
            const cartItems = Array.isArray(response.data) 
              ? response.data.map((item: any) => ({
                  ...item,
                  quantity: item.quantity || 1,
                  price: item.price || item.productPrice
                }))
              : [];
            
            setItems(cartItems);
          }
        } catch (getCartError: any) {
          // Log detallado del error al obtener carrito
          console.log('❌ Error al obtener carrito:', {
            status: getCartError.response?.status,
            message: getCartError.message,
            data: getCartError.response?.data,
            url: getCartError.config?.url
          });
  
          // Si el carrito no existe (404), intentamos crearlo
          if (getCartError.response?.status === 404) {
            console.log('🆕 Carrito no encontrado, creando uno nuevo...');
            
            const createCartUrl = `${API_URL}/cart/create`;
            console.log('URL para crear carrito:', createCartUrl);
  
            try {
              // Intenta crear el carrito con más detalles de debug
              const createCartResponse = await axios.post(
                createCartUrl,
                { userId },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  // Timeout más largo para debug
                  timeout: 10000,
                  // Permitir ver la respuesta completa para debug
                  validateStatus: (status) => true
                }
              );
  
              // Log de la respuesta de creación
              console.log('📝 Respuesta de creación de carrito:', {
                status: createCartResponse.status,
                data: createCartResponse.data,
                headers: createCartResponse.headers
              });
  
            } catch (createError: any) {
              // Log muy detallado del error de creación
              console.error('⚠️ Error detallado al crear carrito:', {
                name: createError.name,
                message: createError.message,
                code: createError.code,
                response: {
                  status: createError.response?.status,
                  statusText: createError.response?.statusText,
                  data: createError.response?.data,
                  headers: createError.response?.headers
                },
                request: {
                  method: createError.config?.method,
                  url: createError.config?.url,
                  data: createError.config?.data,
                  headers: createError.config?.headers
                },
                isAxiosError: createError.isAxiosError,
                stack: createError.stack
              });
  
              setItems([]);
            }
          }
          setItems([]);
        }
      } catch (error: any) {
        // Log del error general
        console.error('🔥 Error general en loadCart:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          type: typeof error
        });
        setItems([]);
      }
    };
  
    // Ejecutar con manejo de errores adicional
    loadCart().catch(error => {
      console.error('💥 Error no manejado en loadCart:', {
        error,
        message: error.message,
        stack: error.stack
      });
    });
  }, []);
  
  const addItemToCart = async (item: IProducts): Promise<void> => {
    try {
        // 1. Validar estado del producto
        if (item.State !== ProductState.Disponible) {
            throw new Error(`Producto no disponible`);
        }

        // 2. Obtener credenciales
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // Debug de credenciales
        console.log('Credenciales:', {
            hasToken: !!token,
            hasUserId: !!userId,
            userId
        });

        if (!token || !userId) {
            throw new Error('Necesitas iniciar sesión');
        }

        // 3. Verificar URL
        const url = `${API_URL}/cart/add`;
        console.log('URL de la petición:', url);

        // 4. Preparar payload según tu API
        const payload = {
            userId: userId,
            products: [{
                productId: item.id,
                quantity: 1
            }]
        };

        // Debug del payload
        console.log('Payload:', payload);

        // 5. Realizar petición con manejo de errores específico
        try {
            const response = await axios.post(
                url,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Debug de respuesta exitosa
            console.log('Respuesta:', {
                status: response.status,
                data: response.data
            });

            // 6. Actualizar estado local solo si la petición fue exitosa
            setItems(currentItems => {
                const existingItem = currentItems.find(i => i.id === item.id);
                
                if (existingItem) {
                    if (existingItem.quantity >= item.stock) {
                        throw new Error('Stock no disponible');
                    }
                    return currentItems.map(i => 
                        i.id === item.id 
                            ? { ...i, quantity: i.quantity + 1 } 
                            : i
                    );
                }
                
                return [...currentItems, { ...item, quantity: 1 }];
            });

            setIsOpen(true);

        } catch (axiosError: any) {
            // 7. Manejo específico de errores de red
            if (axiosError.response?.status === 500) {
                console.error('Error 500 del servidor:', {
                    data: axiosError.response.data,
                    url: axiosError.config.url,
                    method: axiosError.config.method,
                    payload: axiosError.config.data
                });
                throw new Error('Error interno del servidor. Por favor, intenta de nuevo más tarde.');
            }

            throw axiosError;
        }

    } catch (error: any) {
        // 8. Log detallado del error
        console.error('Error completo:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config && {
                url: error.config.url,
                method: error.config.method,
                data: JSON.parse(error.config.data || '{}')
            }
        });

        throw new Error(error.message || 'Error al agregar producto al carrito');
    }
};
  
  const removeItemFromCart = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) throw new Error('No authentication token found');
  
      // Ruta corregida a /cart/remove
      await axios.delete(`${API_URL}/cart/remove`, {
        data: { userId, productId: id },
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setItems(currentItems => currentItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };
  
  const updateItemQuantity = async (id: string, delta: number) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) throw new Error('No authentication token found');
  
      const item = items.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
  
      // Calcular nueva cantidad y validar
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        // Si la nueva cantidad es 0 o menor, eliminar el item
        return removeItemFromCart(id);
      }
  
      await axios.put(`${API_URL}/cart/update`, 
        {
          userId,
          productId: id,
          quantity: newQuantity // Aseguramos que siempre sea > 0
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      setItems(currentItems => {
        return currentItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  };


  const processPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
    
      if (!token || !userId) {
        throw new Error('No se encontró token de autenticación o ID de usuario');
      }
  
      console.log('Items antes de pagar:', items);
  
      // Log detallado de precios
      items.forEach(item => {
        console.log('Detalle de item:', {
          id: item.id,
          price: item.price,
          productPrice: item.productPrice,
          quantity: item.quantity
        });
      });
  
      const response = await axios.post(
        `${API_URL}/order/${userId}/convert-cart`,
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
      if (response.data?.checkoutUrl) {
        emptyCart();
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error('No se recibió la URL de checkout');
      }
    
    } catch (error: any) {
      console.error('Error al procesar pago:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        detalles: error.response?.data?.details
      });
      
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  };
  



  const emptyCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const countItems = (id: string) => items.find(item => item.id === id)?.quantity || 0;
  const getCartTotal = () => items.reduce((total, item) => {
    // Intenta obtener el precio, primero de 'price', luego de 'productPrice'
    const price = item.price ?? item.productPrice;
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price) 
      : price;
    return total + numericPrice * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
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