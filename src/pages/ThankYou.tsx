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

const TYPEFORM_ID = "01JZ6QNNAEQ8YV8020RQBXV9VV";
const TYPEFORM_SCRIPT_URL = "//embed.typeform.com/next/embed.js";

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
  const [isTypeformLoaded, setIsTypeformLoaded] = useState(false);

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
    // Check if script is already loaded
    if (document.querySelector(`script[src="${TYPEFORM_SCRIPT_URL}"]`)) {
      setIsTypeformLoaded(true);
      handleAutoOpen();
      return;
    }

    // Inject Typeform embed script
    const script = document.createElement("script");
    script.src = TYPEFORM_SCRIPT_URL;
    script.async = true;
    
    script.onload = () => {
      setIsTypeformLoaded(true);
      handleAutoOpen();
    };

    script.onerror = (error) => {
      console.error("Failed to load Typeform script:", error);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      const existingScript = document.querySelector(`script[src="${TYPEFORM_SCRIPT_URL}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handleAutoOpen = () => {
    const hasShown = sessionStorage.getItem("typeformShown");
    if (!hasShown && window?.typeform?.open) {
      window.typeform.open({ id: TYPEFORM_ID });
      sessionStorage.setItem("typeformShown", "true");
    }
  };

  const openTypeform = () => {
    if (!isTypeformLoaded) {
      console.warn("Typeform is still loading. Please try again.");
      return;
    }

    if (window?.typeform?.open) {
      window.typeform.open({ id: TYPEFORM_ID });
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
              disabled={!isTypeformLoaded}
              className={`
                bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg mb-3 transition-all duration-200
                ${isTypeformLoaded 
                  ? 'hover:bg-green-700 hover:shadow-xl transform hover:scale-105' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              Give Feedback 💬
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-primary-green hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition w-full"
          >
            Back to Menu
          </button>

          {/* Required Typeform container */}
          <div data-tf-live={TYPEFORM_ID} style={{ display: "none" }} />
        </div>
      )}
    </div>
  );
}