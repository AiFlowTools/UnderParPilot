import React, { useEffect, useState, useRef } from 'react';
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

// Extend Window interface to include typeform
declare global {
  interface Window {
    typeform?: {
      open: (options: { id: string }) => void;
    };
  }
}

export default function ThankYou() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Clear cart once we arrive on this page
    localStorage.removeItem('cart');

    if (!sessionId) {
      setLoading(false);
      setError('No session ID provided');
      return;
    }

    // Look up the order by stripe_session_id
    const fetchOrder = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('id, ordered_items, hole_number')
          .eq('stripe_session_id', sessionId)
          .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          // Order not found - this is expected immediately after payment
          // as there might be a slight delay before the webhook creates the order
          setTimeout(fetchOrder, 2000); // Retry after 2 seconds
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

  useEffect(() => {
    // Load Typeform embed script
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Auto-open Typeform once per session
    const hasShown = sessionStorage.getItem("typeformShown");
    if (!hasShown) {
      const interval = setInterval(() => {
        if (window?.typeform) {
          window.typeform.open({
            id: "01JZ6QNNAEQ8YV8020RQBXV9VV",
          });
          sessionStorage.setItem("typeformShown", "true");
          clearInterval(interval);
        }
      }, 500);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, []);

  const openTypeform = () => {
    if (window?.typeform) {
      window.typeform.open({
        id: "01JZ6QNNAEQ8YV8020RQBXV9VV",
      });
    }
  };

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
          
          {/* Feedback Button */}
          <div className="mb-6">
            <button
              onClick={openTypeform}
              ref={buttonRef}
              className="bg-green-600 hover:bg-green-700 hover:shadow-lg text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Give Feedback 💬
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-primary-green hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Back to Menu
          </button>

          {/* Hidden div required for Typeform's live embed to work */}
          <div data-tf-live="01JZ6QNNAEQ8YV8020RQBXV9VV" style={{ display: "none" }}></div>
        </div>
      )}
    </div>
  );
}