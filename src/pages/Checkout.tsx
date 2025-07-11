import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
} from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { requestGeolocation, GeolocationError } from '../lib/geolocation';
import { useCourse } from '../hooks/useCourse';

interface CartItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  note?: string;
}

interface OrderStatus {
  success: boolean;
  message: string;
}

interface SubmitOrderOptions {
  location?: { lat: number; lng: number };
  hole?: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { course, loading: courseLoading, error: courseError } = useCourse();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [showHoleSelect, setShowHoleSelect] = useState(false);
  const [selectedHole, setSelectedHole] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const updated = cart
      .map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter(item => item.quantity > 0);
    updateCart(updated);
  };

  const updateItemNote = (itemId: string, note: string) => {
    const updated = cart.map(item =>
      item.id === itemId ? { ...item, note: note.trim() || undefined } : item
    );
    updateCart(updated);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async (options: SubmitOrderOptions = {}) => {
    if (!course?.id || cart.length === 0) return;
    setIsSubmitting(true);
    setOrderStatus(null);

    try {
      const lineItems = cart.map(item => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.item_name,
            images: item.image_url ? [item.image_url] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const combinedNotes = cart
        .filter(item => item.note)
        .map(item => `${item.item_name}: ${item.note}`)
        .join('\n');

      const { url } = await createCheckoutSession(
        lineItems,
        `${window.location.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        `${window.location.origin}/checkout`,
        course.id,
        combinedNotes,
        options.location,
        options.hole
      );

      if (!url) throw new Error('Failed to create checkout session.');
      window.location.href = url;
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setOrderStatus({
        success: false,
        message: err.message || 'An unexpected error occurred.',
      });
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const location = await requestGeolocation();
      await submitOrder({
        location: { lat: location.latitude, lng: location.longitude },
      });
    } catch (err) {
      if (
        err instanceof GeolocationError &&
        err.code === GeolocationError.PERMISSION_DENIED
      ) {
        setShowHoleSelect(true);
      } else {
        await submitOrder();
      }
    }
  };

  const handleManualSubmit = async () => {
    if (!selectedHole) {
      setOrderStatus({
        success: false,
        message: 'Please select a hole number',
      });
      return;
    }
    await submitOrder({ hole: selectedHole });
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-gray-800 text-xl mb-4">{courseError || 'Course not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      <div className="max-w-xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/menu')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h1>

        {orderStatus && (
          <div className={`mb-4 p-3 rounded-lg ${orderStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {orderStatus.success ? <CheckCircle2 className="inline w-5 h-5 mr-1" /> : <AlertCircle className="inline w-5 h-5 mr-1" />} 
            {orderStatus.message}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} alt={item.item_name} className="w-12 h-12 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.item_name}</p>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                    <textarea
                      value={item.note || ''}
                      onChange={(e) => updateItemNote(item.id, e.target.value)}
                      placeholder="Add note (e.g. no onions)"
                      className="mt-2 w-full border border-gray-200 rounded-md p-2 text-sm"
                      rows={2}
                      maxLength={100}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 p-4 z-50">
        <div className="flex justify-between mb-4">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {showHoleSelect ? (
          <>
            <select
              value={selectedHole}
              onChange={(e) => setSelectedHole(Number(e.target.value))}
              className="w-full mb-4 p-3 border rounded-lg"
            >
              <option value={0}>Select Hole</option>
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Hole {i + 1}</option>
              ))}
            </select>
            <button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Processing…' : 'Submit Order'}
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="w-1/2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-1/2 py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Processing…' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
