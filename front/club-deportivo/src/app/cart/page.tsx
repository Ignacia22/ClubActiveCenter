'use client';

import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { 
    items, 
    updateItemQuantity, 
    removeItemFromCart, 
    getCartTotal,
    processPayment,
    isProcessingPayment
  } = useCart();


  const handlePayment = async () => {
    try {
      await processPayment();
    } catch (error: unknown) {
      // Manejo de error con type guard
      if (error instanceof Error) {
        console.error('Error al procesar el pago:', error.message);
        // Mostrar mensaje de error al usuario
        alert(`Error al procesar el pago: ${error.message}`);
      } else {
        console.error('Error desconocido al procesar el pago', error);
        alert('Ocurrió un error desconocido al procesar el pago');
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">¿Por qué no agregas algunos productos?</p>
          <Link 
            href="/" 
            className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-black/90 transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 text-black">
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-black">{item.name}</h3>
                  <p className="text-gray-600">${Number(item.price).toFixed(2)}</p>
                  {item.quantity >= item.stock && (
                    <p className="text-yellow-500 text-xs mt-1">
                      Stock máximo: {item.stock}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateItemQuantity(item.id, -1)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className={`h-4 w-4 ${item.quantity <= 1 ? 'text-gray-300' : ''}`} />
                  </button>
                  
                  <span className="w-8 text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateItemQuantity(item.id, 1)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className={`h-4 w-4 ${item.quantity >= item.stock ? 'text-gray-300' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => removeItemFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-black">Resumen del pedido</h2>

            
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className='text-black'>{item.name} (x{item.quantity})</span>
                  <span className='text-black'>${Number(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold">
                <span className='text-black'>Total</span>
                <span className='text-black'>${Number(getCartTotal()).toFixed(2)}</span>
              </div>
            </div>

            <button
          onClick={handlePayment}
          disabled={isProcessingPayment || items.length === 0}
          className={`
            w-full py-3 rounded-md text-center 
            ${isProcessingPayment || items.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-black/90 transition-colors'
            }
          `}
        >
          {isProcessingPayment 
            ? 'Procesando...' 
            : 'Proceder al pago'
          }
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
    </div>
  );
}