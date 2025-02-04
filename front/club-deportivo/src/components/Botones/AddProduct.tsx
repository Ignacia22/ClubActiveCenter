"use client"

import { useCart } from "@/context/CartContext";
import { IProducts, ProductState } from "@/interface/IProducts";
import { useEffect, useState } from "react";

export default function AddProduct ({ product }: { product: IProducts }) {
  const { addItemToCart, items, countItems } = useCart();
  const [disabled, setDisabled] = useState(false);

  const clickHandler = () => {
      addItemToCart(product);
  };

  useEffect(() => {
    const itemCount = countItems(product.id);
    const isDisabled = itemCount >= product.stock || product.State !== ProductState.Disponible;
    console.log(`Product ${product.id}: count=${itemCount}, stock=${product.stock}, state=${product.State}, disabled=${isDisabled}`);
    setDisabled(isDisabled);
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