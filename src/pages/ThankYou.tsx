import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  ordered_items: {
    item_name: string;
    quantity: number;
  }[];
  hole_number: number;
}

export default function ThankYou() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  // Only inject the script once
  if (!document.getElementById('typeform-script')) {
    const script = document.createElement('script');
    script.id = 'typeform-script';
    script.src = '//embed.typeform.com/next/embed.js';
    script.async = true;

    script.onload = () => {
      console.log('✅ Typeform script loaded');

      // Only show popup once per session
      if (!sessionStorage.getItem('typeformShown')) {
        sessionStorage.setItem('typeformShown', 'true');

        // Delay popup slightly for smoother UX
        setTimeout(() => {
          if (window?.typeformEmbed?.makePopup) {
            window.typeformEmbed
              .makePopup('https://form.typeform.com/to/pMxEV0gN', {
                mode: 'popup',
                autoClose: 0,
                hideHeaders: true,
                hideFooter: true,
              })
              .open();
          } else {
            console.warn('❌ Typeform popup method not found.');
          }
        }, 2000);
      }
    };

    document.body.appendChild(script);
  }
}, []);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError('No session ID provided');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('id, ordered_items, hole_number')
          .eq('stripe_session_id', sessionId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) {
          setTimeout(fetchOrder, 2000);
          return;
        }

        setOrder(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError('Unable to find your order. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  const getOrderSummary = () => {
    if (!order?.ordered_items) return '';
    return order.ordered_items
      .map(item => `${item.quantity}x ${item.item_name}`)
      .join(', ');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      {loading ? (
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600" />
      ) : error ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fadeIn max-w-md w-full">
          <div className="flex justify-center mb-6">
            <AlertCircle className="text-red-600 w-20 h-20" />
          </div>
          <h1 className="text-3xl font-serif text-charcoal mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-charcoal mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-green hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Return to Menu
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fadeIn max-w-md w-full">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="text-green-600 w-20 h-20 animate-bounce-subtle" />
          </div>
          <h1 className="text-3xl font-serif text-charcoal mb-4">
            Thank you for your order!
          </h1>
          {order ? (
            <p className="text-charcoal mb-6">
              Order <strong>#{order.id.slice(0, 8)}</strong> confirmed!<br />
              {getOrderSummary()}<br />
              We'll deliver it to hole <strong>#{order.hole_number}</strong> shortly.
            </p>
          ) : (
            <p className="text-charcoal mb-6">
              Your payment was successful. Your order will be prepared shortly!
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="bg-primary-green hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition w-full max-w-xs mx-auto"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
