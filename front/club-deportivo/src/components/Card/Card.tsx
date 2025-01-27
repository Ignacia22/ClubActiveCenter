/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { IProducts } from "@/app/Interfaces/IProducts";

export default function Card({ product }: { product: IProducts }) {
  return (
    <div className="bg-black text-white">
      <div>
        {/* Card del producto */}
        <div className="relative bg-white rounded-lg shadow-lg shadow-gray-500/50 overflow-hidden hover:shadow-xl transition-shadow h-full">
          <div className="relative w-full h-80">
            {/* Imagen del producto */}
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-1/3"></div>
          </div>
          <div className="p-4 flex flex-col justify-between h-full">
            <h2 className="text-md font-bold truncate text-black text-center">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {product.description}
            </p>
            <p className="text-sm text-gray-600 text-center">
              Precio: ${product.price}
            </p>
            <p className="text-sm text-gray-600 text-center">
              Estado: {product.State}
            </p>

            {/* Botón de "Ver más Detalles" con Link para redirigir */}
            <Link href={`/products/${product.id}`} passHref>
              <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                Ver más detalles
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
