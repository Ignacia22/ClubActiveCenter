"use client";

import { getProducts } from "@/helpers/getProducts";
import { useEffect, useState } from "react";
import { IProducts } from "../../../interface/IProducts";
import Card from "../../../components/Card/Card";

export default function Tienda() {
  const [products, setProducts] = useState<IProducts[]>([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res))
      .catch(() => {
        alert("Error al obtener los productos");
      });
  }, []);

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
      </div>
    </div>
  );
}
