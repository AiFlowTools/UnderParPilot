// Updated Checkout.tsx with tax, fee, and order detail breakdown

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Pen } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';

interface CartItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  note?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { course } = useCourse();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const fee = 2.5;
  const gst = (subtotal + fee) * 0.05;
  const qst = (subtotal + fee) * 0.09975;
  const total = subtotal + fee + gst + qst;

  const placeOrder = async () => {
    setSubmitting(true);

    const order = {
      items: cart,
      subtotal,
      convenience_fee: fee,
      gst,
      qst,
      total,
      course_id: course?.id || null,
      created_at: new Date().toISOString(),
    };

    const res = await fetch('/api/place-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      clearCart();
      navigate('/thank-you');
    } else {
      alert('Failed to place order.');
    }

    setSubmitting(false);
  };

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 flex items-center mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Menu
      </button>

      <h2 className="text-xl font-semibold mb-4">Your Order</h2>

      {cart.map((item) => (
        <div key={item.id} className="border rounded p-3 mb-3 flex items-center justify-between">
          <div>
            <div className="font-semibold">{item.item_name}</div>
            <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
            {item.note && <div className="text-sm italic">Note: {item.note}</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-100 rounded">
              <Minus className="w-4 h-4" />
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-100 rounded">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Order Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Convenience Fee</span>
          <span>${fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>${gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>QST (9.98%)</span>
          <span>${qst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={clearCart}
          className="w-1/2 border border-gray-300 px-4 py-2 rounded text-gray-700"
          disabled={submitting}
        >
          Clear Cart
        </button>
        <button
          onClick={placeOrder}
          className="w-1/2 bg-green-600 text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Place Order'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        * A $2.50 mobile ordering fee & taxes are included in your total.
      </p>
    </div>
  );
}
