/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import { useCart } from "@/context/CartContext";
import { IProducts } from "@/interface/IProducts";
import { useEffect, useState } from "react";


export default function AddProduct ({product}: {product: IProducts}) {
    const {addItemToCart, items, countItems} = useCart()
    const [disabled, setDisabled] = useState(false);

    const clickHandler = () => {
        addItemToCart(product);
    }

    useEffect(() => {
        countItems(product.id) >= product.stock && setDisabled(true)
        //countItems(product.id) >= 1 && setDisabled(true)
    }, [items]) 


    return (
        <button 
        className="bg-white text-black hover:bg-slate-400 p-4 font-semibold rounded-xl" 
        onClick={clickHandler}
        disabled={disabled}
        >ADD PRODUCT TO CART
        </button>
    )
}