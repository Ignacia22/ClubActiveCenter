"use client"
import { useCart } from "@/context/CartContext";
import { IProducts } from "@/interface/IProducts";
import { useEffect, useState } from "react";

export default function AddProduct ({ product }: { product: IProducts }) {
    const { addItemToCart, items, countItems } = useCart();
    const [disabled, setDisabled] = useState(false);
  
    const clickHandler = () => {
      addItemToCart(product);
    };
  
    useEffect(() => {
      // Verifica si la cantidad en el carrito ha alcanzado el límite de stock
      setDisabled(countItems(product.id) >= product.stock);
    }, [items, product, countItems]);
  
    return (
      <button
        className="bg-white text-black hover:bg-slate-400 p-4 font-semibold rounded-xl"
        onClick={clickHandler}
        disabled={disabled}
      >
        ADD PRODUCT TO CART
      </button>
    );
  }
  