// components/ProductContainer.tsx

import Link from "next/link";

import { useCart } from "@/context/CartContext";
import Card from "../Card/Card";
import { IProducts } from "@/interface/IProducts";

interface ProductContainerProps {
  products: IProducts[];
}

export default function ProductContainer({ products }: ProductContainerProps) {
  const { addItemToCart, items } = useCart();

  // Función para verificar si un producto ya está en el carrito
  const isProductInCart = (id: string) => items.some((item) => item.id === id);

  const handleAddToCart = (product: IProducts) => {
    addItemToCart(product);
  };

  return (
    <div className="p-18 m-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-2">
      {products.map((product: IProducts) => (
        <div key={product.id} className="relative">
          <Link href={`product/:${product.id}`}>
            <Card
              product={product}
              onAddToCart={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
              disabled={isProductInCart(product.id)}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}