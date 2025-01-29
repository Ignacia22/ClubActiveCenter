import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';

interface CartButtonProps {
  itemCount?: number;
}

export function CartButton({ itemCount = 0 }: CartButtonProps) {
  return (
    <div className="relative z-50 h-full flex items-center">
      <Dialog.Root>
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
          <Dialog.Content className="fixed right-0 top-0 h-[100vh] w-full max-w-md bg-black shadow-xl z-50 animate-in slide-in-from-right">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <Dialog.Title className="text-lg font-medium text-white">
                  Carrito de Compras
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-2 hover:bg-white/10 rounded-full text-white">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {itemCount === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/70">
                    <ShoppingCart className="h-12 w-12 mb-4" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="text-white">
                    {/* Aquí irían los productos */}
                    <p>Productos en el carrito</p>
                  </div>
                )}
              </div>

              {/* Footer con botones */}
              <div className="p-4 border-t border-white/10 space-y-3">
                <Link 
                  href="/cart"
                  className="block w-full text-center bg-white/10 text-white py-2 px-4 rounded-md hover:bg-white/20 transition-colors"
                >
                  Ver carrito
                </Link>
                {itemCount > 0 && (
                  <Link
                    href="/checkout"
                    className="block w-full text-center bg-white text-black py-2 px-4 rounded-md hover:bg-white/90 transition-colors"
                  >
                    Proceder al pago
                  </Link>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}