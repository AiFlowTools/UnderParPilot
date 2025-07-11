import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Edit3,
  Check,
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
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [showHoleSelect, setShowHoleSelect] = useState(false);
  const [selectedHole, setSelectedHole] = useState<number>(0);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<Record<string, string>>({});

  // Load cart on mount
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

  const removeItem = (itemId: string) => {
    updateCart(cart.filter(item => item.id !== itemId));
  };

  const updateItemNote = (itemId: string, note: string) => {
    const updated = cart.map(item =>
      item.id === itemId ? { ...item, note: note.trim() || undefined } : item
    );
    updateCart(updated);
  };

  const startEditingNote = (itemId: string, currentNote: string = '') => {
    setEditingNoteId(itemId);
    setTempNotes(prev => ({ ...prev, [itemId]: currentNote }));
    
    // Scroll into view after a brief delay to ensure DOM is updated
    setTimeout(() => {
      const element = document.getElementById(`note-input-${itemId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }, 100);
  };

  const saveNote = (itemId: string) => {
    const note = tempNotes[itemId] || '';
    updateItemNote(itemId, note);
    setEditingNoteId(null);
    setTempNotes(prev => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setTempNotes({});
  };

  // Auto-save debounce for notes
  useEffect(() => {
    if (!editingNoteId) return;
    
    const timeoutId = setTimeout(() => {
      const note = tempNotes[editingNoteId];
      if (note !== undefined) {
        updateItemNote(editingNoteId, note);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tempNotes, editingNoteId]);
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

      const combinedNotes = [
        notes,
        ...cart
          .filter(item => item.note)
          .map(item => `${item.item_name}: ${item.note}`)
      ].filter(Boolean).join('\n');

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
        location: { lat: location.latitude, lng: location.longitude }
      });
    } catch (err) {
      if (err instanceof GeolocationError && err.code === GeolocationError.PERMISSION_DENIED) {
        setShowHoleSelect(true);
      } else {
        // For other errors, proceed without location
        await submitOrder();
      }
    }
  };

  const handleManualSubmit = async () => {
    if (!selectedHole) {
      setOrderStatus({
        success: false,
        message: 'Please select a hole number'
      });
      return;
    }
    await submitOrder({ hole: selectedHole });
  };

  // Show loading state while course is loading
  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

  // Show error if course failed to load
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/menu')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Return to menu"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Order</h1>

        {/* Order Status */}
        {orderStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              orderStatus.success
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {orderStatus.success ? (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <p>{orderStatus.message}</p>
          </div>
        )}

        {cart.length === 0 ? (
          // Empty Cart
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        ) : (
          // Cart with items + notes + subtotal
          <>
            {/* Global Notes / Allergies */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Allergies (optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requests or allergy info?"
                rows={3}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Line items */}
            <div className="space-y-3 mb-8 px-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
                  style={{ 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    minHeight: '44px'
                  }}
                >
                  {/* Main Item Row */}
                  <div className="p-4 flex items-center gap-4" style={{ minHeight: '44px' }}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm flex-shrink-0"
                      />
                    )}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {item.item_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                        aria-label="Decrease quantity"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                        aria-label="Increase quantity"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Remove item"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <p className="font-semibold text-gray-900 text-base mt-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Per-Item Note Section */}
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {editingNoteId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          id={`note-input-${item.id}`}
                          value={tempNotes[item.id] || ''}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 100); // 100 char limit
                            setTempNotes(prev => ({ ...prev, [item.id]: value }));
                          }}
                          placeholder="Add special instructions (e.g. No onions)"
                          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          style={{ 
                            backgroundColor: '#F5F5F5',
                            minHeight: '80px'
                          }}
                          rows={3}
                          maxLength={100}
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNote(item.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                              style={{ minHeight: '44px' }}
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={cancelEditingNote}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                              style={{ minHeight: '44px' }}
                            >
                              Cancel
                            </button>
                          </div>
                          <span className="text-xs text-gray-500">
                            {(tempNotes[item.id] || '').length}/100
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingNote(item.id, item.note)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                        style={{ minHeight: '44px' }}
                        aria-label={`${item.note ? 'Edit' : 'Add'} note for ${item.item_name}`}
                      >
                        {item.note ? (
                          <div className="flex items-start gap-2">
                            <Edit3 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium text-gray-700">Note:</span>
                              <p className="text-sm text-gray-600 mt-1">{item.note}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-base">📝</span>
                            <span className="text-sm font-medium">Add note</span>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Checkout */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {showHoleSelect ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hole-select" className="block text-base font-medium text-gray-700 mb-2">
                      Select Hole Number
                    </label>
                    <select
                      id="hole-select"
                      value={selectedHole}
                      onChange={(e) => setSelectedHole(Number(e.target.value))}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                      style={{ minHeight: '44px' }}
                    >
                      <option value={0}>Select a hole...</option>
                      {Array.from({ length: 18 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Hole {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={clearCart}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-base"
                      style={{ minHeight: '44px' }}
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleManualSubmit}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors text-base ${
                        isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      {isSubmitting ? 'Processing…' : 'Submit Order'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-base"
                    style={{ minHeight: '44px' }}
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors text-base ${
                      isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    {isSubmitting ? 'Processing…' : 'Place Order'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Bottom padding to account for fixed checkout section */}
            <div className="h-32"></div>
          </>
        )}
      </div>
    </div>
  );
}