'use client';

import { IProducts, ProductState } from "@/interface/IProducts";
import { createContext, useContext, useState, useEffect } from "react";



interface CartItem extends IProducts {
  quantity: number;
}

interface CartContextProps {
  items: CartItem[];
  addItemToCart: (item: IProducts) => void;
  removeItemFromCart: (id: string) => void;
  updateItemQuantity: (id: string, delta: number) => void;
  emptyCart: () => void;
  countItems: (id: string) => number;
  getCartTotal: () => number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextProps>({
  items: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  updateItemQuantity: () => {},
  emptyCart: () => {},
  countItems: () => 0,
  getCartTotal: () => 0,
  itemCount: 0,
  isOpen: false,
  setIsOpen: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('cart');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const addItemToCart = (item: IProducts) => {
    if (item.State !== ProductState.Disponible) {
      console.warn('Producto no disponible');
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Verificar stock antes de incrementar
        if (existingItem.quantity >= item.stock) {
          console.warn('No hay suficiente stock');
          return currentItems;
        }
        
        const newItems = currentItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        localStorage.setItem("cart", JSON.stringify(newItems));
        return newItems;
      }

      const newItems = [...currentItems, { ...item, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
    
    setIsOpen(true);
  };

  const removeItemFromCart = (id: string) => {
    const filtered = items.filter(item => item.id !== id);
    setItems(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
  };

  const updateItemQuantity = (id: string, delta: number) => {
    setItems(currentItems => {
      const newItems = currentItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          
          // Verificar stock antes de actualizar
          if (delta > 0 && newQuantity > item.stock) {
            console.warn('No hay suficiente stock');
            return item;
          }
          
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];

      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const emptyCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const countItems = (id: string) => {
    const item = items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItemToCart,
      removeItemFromCart,
      updateItemQuantity,
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