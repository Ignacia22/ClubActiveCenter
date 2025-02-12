/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { IProducts } from "@/interface/IProducts";
import { usePrivate } from "@/Hooks/usePrivate";

interface CardProps {
  product: IProducts;
  onAddToCart?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export default function Card({ product, onAddToCart, disabled }: CardProps) {
  usePrivate();
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

            <div className="flex items-center justify-between">
              <span className="text-green-600 font-bold">${product.price}</span>
              <span
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-gray-600" : "text-red-500"
                }`}
              >
                {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
              </span>
            </div>

            {/* Botón de "Ver más Detalles" con Link para redirigir */}
            <div className="mt-4">
              <Link href={`/product/:${product.id}`} passHref>
                <button
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                  onClick={onAddToCart}
                  disabled={disabled}
                >
                  {disabled ? "Already in Cart" : "Ver más detalles"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
