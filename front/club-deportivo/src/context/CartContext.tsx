"use client"

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
    console.log('addItemToCart called with item:', item);
  if (item.State !== ProductState.Disponible) {
    console.log('Item not available, State:', item.State);
    return;
  }

    setItems(currentItems => {
        console.log('Current items:', currentItems);
        const existingItem = currentItems.find(i => i.id === item.id);
        if (existingItem && existingItem.quantity < item.stock) {
            console.log('Updating existing item');
            const newItems = currentItems.map(i => 
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            console.log('New items after update:', newItems);
            localStorage.setItem("cart", JSON.stringify(newItems));
            return newItems;
        }

        console.log('Adding new item');
        const newItems = [...currentItems, { ...item, quantity: 1 }];
        console.log('New items after addition:', newItems);
        localStorage.setItem("cart", JSON.stringify(newItems));
        return newItems;
    });
    
    setIsOpen(true);
    console.log('Cart opened');
};

const removeItemFromCart = (id: string) => {
  const filtered = items.filter(item => item.id !== id);
  setItems(filtered);
  localStorage.setItem("cart", JSON.stringify(filtered));

  if (filtered.length === 0) {
    localStorage.removeItem("cart");
  }
};

  const updateItemQuantity = (id: string, delta: number) => {
    setItems(currentItems => {
      const newItems = currentItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          if (delta > 0 && newQuantity > item.stock) return item;
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

  const countItems = (id: string) => items.find(item => item.id === id)?.quantity || 0;
  const getCartTotal = () => items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItemToCart, removeItemFromCart, updateItemQuantity, emptyCart,
      countItems, getCartTotal, itemCount, isOpen, setIsOpen
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