// components/CartModal.tsx
import React from 'react';
import { X, Minus, Plus } from 'lucide-react';

interface CartItem {
  id: string;
  item_name: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onCheckout: () => void;
}

export default function CartModal({
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onCheckout,
}: CartModalProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex flex-col bg-white rounded-t-2xl shadow-lg overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b"
              >
                <div>
                  <p className="font-medium">{item.item_name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDecrease(item.id)}
                    className="w-8 h-8 bg-gray-200 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onIncrease(item.id)}
                    className="w-8 h-8 bg-gray-200 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Total</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
