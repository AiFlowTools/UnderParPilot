import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  Pen,
  Check,
} from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { requestGeolocation, GeolocationError } from '../lib/geolocation';
import { useCourse } from '../hooks/useCourse';
import { useLanguage, getLocalizedContent } from '../hooks/useLanguage';

// Interfaces
interface CartItem {
  id: string;
  item_name: string;
  item_name_fr?: string;
  description_fr?: string;
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
  const { language, t } = useLanguage();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<Record<string, string>>({});
  const [selectedHole, setSelectedHole] = useState<number>(0);
  const [showHoleSelect, setShowHoleSelect] = useState(false);

  // FEE + TAX LOGIC
  const CONVENIENCE_FEE = 2.5;
  const GST_RATE = 0.05;
  const QST_RATE = 0.09975;

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

  const startEditingNote = (itemId: string, currentNote: string = '') => {
    setEditingNoteId(itemId);
    setTempNotes(prev => ({ ...prev, [itemId]: currentNote }));
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

  // TAX CALCULATIONS
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const gstOnSubtotal = subtotal * GST_RATE;
  const qstOnSubtotal = subtotal * QST_RATE;
  const gstOnFee = CONVENIENCE_FEE * GST_RATE;
  const qstOnFee = CONVENIENCE_FEE * QST_RATE;

  const gstTotal = gstOnSubtotal + gstOnFee;
  const qstTotal = qstOnSubtotal + qstOnFee;

  const total =
    subtotal +
    CONVENIENCE_FEE +
    gstTotal +
    qstTotal;

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

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
  options.hole,
  {
    subtotal: subtotal.toFixed(2),
    convenience_fee: CONVENIENCE_FEE.toFixed(2),
    gst: gstTotal.toFixed(2),
    qst: qstTotal.toFixed(2),
    total: total.toFixed(2),
  }
);

      if (!url) throw new Error('Failed to create checkout session.');
      window.location.href = url;
    } catch (err: any) {
      setOrderStatus({
        success: false,
        message: err.message || 'Unexpected error.',
      });
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const location = await requestGeolocation();
      await submitOrder({ location: { lat: location.latitude, lng: location.longitude } });
    } catch (err) {
      if (err instanceof GeolocationError && err.code === GeolocationError.PERMISSION_DENIED) {
        setShowHoleSelect(true);
      } else {
        await submitOrder();
      }
    }
  };

  if (courseLoading) return <div className="p-10 text-center">Loading...</div>;
  if (courseError || !course) return <div className="p-10 text-center">Error loading course</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <button
        onClick={() => navigate('/menu')}
        className="mb-4 flex items-center text-gray-600"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> {t('backToMenu')}
      </button>

      <h1 className="text-2xl font-bold mb-4">{t('yourOrder')}</h1>

      {cart.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
          {t('cartEmpty')}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-28">
            {cart.map(item => {
              const localizedContent = getLocalizedContent(item, language);
              
              return (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url} alt={localizedContent.name} className="w-12 h-12 rounded-md" />
                      <div>
                        <p className="font-semibold">{localizedContent.name}</p>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} {t('each')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 rounded-full bg-gray-100">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 rounded-full bg-gray-100">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editingNoteId === item.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={tempNotes[item.id] || ''}
                        onChange={e => setTempNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full border rounded-md p-2 text-sm"
                        placeholder={t('notePlaceholder')}
                        rows={2}
                      />
                      <button
                        onClick={() => saveNote(item.id)}
                        className="text-green-600 flex items-center gap-1 text-sm font-medium"
                      >
                        <Check className="w-4 h-4" /> {t('saveNote')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditingNote(item.id, item.note)}
                      className="mt-2 flex items-center gap-2 text-sm text-gray-700 hover:text-green-600"
                    >
                      <Pen className="w-4 h-4" /> {item.note ? t('editNote') : t('addNote')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md z-10">
            <div className="space-y-1 mb-3 text-sm">
              <div className="flex justify-between">
                <span>{t('orderSubtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('convenienceFee')}</span>
                <span>${CONVENIENCE_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>${gstTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>QST (9.98%)</span>
                <span>${qstTotal.toFixed(2)}</span>
              </div>
              <hr className="my-1" />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 py-3 border rounded-md text-gray-700"
              >
                {t('clearCart')}
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                {isSubmitting ? t('processing') : t('placeOrder')}
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              {t('mobileOrderingFee')}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
