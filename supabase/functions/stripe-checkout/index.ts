// stripe-checkout/index.ts
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  appInfo: { name: 'Golf Course Food Ordering', version: '1.0.0' },
  apiVersion: '2023-10-16'
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: cors });
  }

  try {
    const {
      line_items,
      success_url,
      cancel_url,
      course_id,
      hole_number,
      notes,
      subtotal_price,
      convenience_fee,
      gst,
      qst,
      total_price,
      ordered_items,
    } = await req.json();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      phone_number_collection: {
    enabled: true
  },
      metadata: {
        course_id,
        hole_number,
        notes,
        subtotal: subtotal_price,
        convenience_fee,
        gst,
        qst,
        total_price,
        ordered_items,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('🔥 Checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
