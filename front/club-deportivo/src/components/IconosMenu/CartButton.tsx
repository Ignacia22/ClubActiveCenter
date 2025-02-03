"use client"

import * as Dialog from '@radix-ui/react-dialog';
import { ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export function CartButton() {
  const { items, itemCount, getCartTotal, setIsOpen, isOpen } = useCart();

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ShoppingCart className="h-6 w-6 text-white" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-md bg-black shadow-xl z-50">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Dialog.Title className="text-lg font-medium text-white">
                Tu Carrito ({itemCount})
              </Dialog.Title>
              <div className="flex items-center gap-4">
                <Link
                  href="/cart"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Ver carrito
                </Link>
                <Dialog.Close className="p-2 hover:bg-white/10 rounded-full text-white">
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/70">
                  <ShoppingCart className="h-12 w-12 mb-4" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-white/5 p-4 rounded-lg">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-white/70">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                        {item.quantity >= item.stock && (
                          <p className="text-yellow-500 text-xs mt-1">
                            Stock máximo alcanzado
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-between text-white mb-4">
                  <span>Total:</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-white text-black py-2 px-4 rounded-md hover:bg-white/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Proceder al pago
                </Link>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
