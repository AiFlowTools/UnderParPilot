import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Minus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ShoppingBag
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

export default function Checkout() {
  const navigate = useNavigate();
  const { course, loading: courseLoading, error: courseError } = useCourse();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [noteOpenIds, setNoteOpenIds] = useState<Set<string>>(new Set());
  const [selectedHole, setSelectedHole] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showHoleSelect, setShowHoleSelect] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter(item => item.quantity > 0);
    updateCart(updated);
  };

  const toggleNote = (id: string) => {
    setNoteOpenIds(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const updateNote = (id: string, note: string) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, note } : item
    );
    updateCart(updated);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async (location?: { lat: number; lng: number }, hole?: number) => {
    if (!course?.id || cart.length === 0) return;
    setIsSubmitting(true);
    setOrderStatus(null);

    try {
      const lineItems = cart.map(item => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.item_name,
            images: item.image_url ? [item.image_url] : undefined
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      }));

      const combinedNotes = cart
        .filter(item => item.note)
        .map(item => `${item.item_name}: ${item.note}`)
        .join('\n');

      const { url } = await createCheckoutSession(
        lineItems,
        window.location.origin + '/thank-you?session_id={CHECKOUT_SESSION_ID}',
        window.location.origin + '/checkout',
        course.id,
        combinedNotes,
        location,
        hole
      );

      if (!url) throw new Error('Failed to create checkout session');
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setOrderStatus({
        success: false,
        message: err.message || 'Something went wrong.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const location = await requestGeolocation();
      await submitOrder({ lat: location.latitude, lng: location.longitude });
    } catch (err) {
      if (err instanceof GeolocationError && err.code === GeolocationError.PERMISSION_DENIED) {
        setShowHoleSelect(true);
      } else {
        await submitOrder();
      }
    }
  };

  const handleManualSubmit = async () => {
    if (!selectedHole) {
      setOrderStatus({ success: false, message: 'Select a hole number' });
      return;
    }
    await submitOrder(undefined, selectedHole);
  };

  if (courseLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-xl text-gray-700 mb-4">{courseError || 'Course not found'}</p>
          <button onClick={() => window.location.reload()} className="bg-green-600 text-white px-4 py-2 rounded">
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <button onClick={() => navigate('/menu')} className="flex items-center mb-6 text-gray-700">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
      </button>

      <h1 className="text-2xl font-bold mb-4">Your Order</h1>

      {orderStatus && (
        <div className={`mb-4 p-3 rounded text-sm flex items-center ${orderStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {orderStatus.success ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
          {orderStatus.message}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <ShoppingBag className="mx-auto w-12 h-12 mb-4" />
          Your cart is empty.
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-32">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center mb-3">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.item_name} className="w-12 h-12 object-cover rounded mr-3" />
                  )}
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">{item.item_name}</h2>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center border rounded-full">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center border rounded-full">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button onClick={() => toggleNote(item.id)} className="flex items-center text-sm text-gray-600 mb-2">
                  <Edit3 className="w-4 h-4 mr-1" /> {item.note ? 'Edit Note' : 'Add Note'}
                </button>
                {noteOpenIds.has(item.id) && (
                  <textarea
                    value={item.note || ''}
                    onChange={e => updateNote(item.id, e.target.value)}
                    placeholder="Add note (e.g. No onions)"
                    className="w-full border rounded p-2 text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {showHoleSelect ? (
              <>
                <select
                  value={selectedHole}
                  onChange={(e) => setSelectedHole(Number(e.target.value))}
                  className="w-full mb-3 p-2 border rounded text-sm"
                >
                  <option value={0}>Select hole...</option>
                  {Array.from({ length: 18 }, (_, i) => (
                    <option key={i} value={i + 1}>Hole {i + 1}</option>
                  ))}
                </select>
                <button onClick={handleManualSubmit} disabled={isSubmitting} className="w-full bg-green-600 text-white p-3 rounded">
                  {isSubmitting ? 'Processing…' : 'Submit Order'}
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={clearCart} className="flex-1 border border-gray-300 text-gray-700 p-3 rounded">
                  Clear Cart
                </button>
                <button onClick={handlePlaceOrder} disabled={isSubmitting} className="flex-1 bg-green-600 text-white p-3 rounded">
                  {isSubmitting ? 'Processing…' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
