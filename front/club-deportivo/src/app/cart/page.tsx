/* eslint-disable @next/next/no-img-element */
"use client";

import { useCart } from "@/context/CartContext";
import { usePrivate } from "@/Hooks/usePrivate";
import Link from "next/link";

export default function CartPage() {
  usePrivate();
  const {
    getCartTotal,
    processPayment,
    isProcessingPayment,
    items,
    updateItemQuantity,
  } = useCart();

  const handlePayment = async () => {
    try {
      await processPayment();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al procesar el pago:", error.message);
        alert(`Error al procesar el pago: ${error.message}`);
      } else {
        console.error("Error desconocido al procesar el pago", error);
        alert("Ocurrió un error desconocido al procesar el pago");
      }
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return; // No permitir cantidad negativa
    updateItemQuantity(id, newQuantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Resumen del Pedido</h1>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-24">
          <h2 className="text-lg font-bold mb-4 text-black">
            Productos en el carrito
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-white/5 p-4 rounded-lg"
              >
                <div className="relative w-16 h-16">
                  <img
                    src={item.image || "/placeholder-image.jpg"}
                    alt={item.name}
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-black font-medium">{item.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-12 text-center border rounded-md"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-black">
                    $
                    {typeof item.price === "number"
                      ? item.price.toFixed(2)
                      : parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold">
              <span className="text-black">Total</span>
              <span className="text-black">
                ${Number(getCartTotal()).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className={`w-full py-3 rounded-md text-center 
              ${
                isProcessingPayment
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-black/90 transition-colors"
              }
            `}
          >
            {isProcessingPayment ? "Procesando..." : "Proceder al pago"}
          </button>

          <Link
            href="/tienda"
            className="block w-full text-center mt-4 text-sm text-gray-600 hover:text-black"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
