// /src/lib/stripe.ts
import { supabase } from './supabase';
import { requestGeolocation } from './geolocation';

interface Geo {
  latitude: number;
  longitude: number;
}

export async function createCheckoutSession(
  lineItems: any[],
  successUrl: string,
  cancelUrl: string,
  courseId: string,
  notes: string = '',
  location?: { lat: number; lng: number },
  holeNumber?: number
) {
  // 1) grab the user's lat/lng if not provided
  let lat: number = location?.lat ?? 0;
  let lng: number = location?.lng ?? 0;

  // 2) call your nearest_hole RPC if no hole number provided
  let finalHoleNumber = holeNumber;
  if (!finalHoleNumber) {
    const { data: holes, error: holeErr } = await supabase
      .rpc('nearest_hole', {
        course_id: courseId,
        p_lat: lat,
        p_lng: lng,
      });

    if (holeErr) {
      console.error('Error calling nearest_hole:', holeErr);
      throw holeErr;
    }
    if (!holes || holes.length === 0) {
      throw new Error('No hole returned from nearest_hole');
    }
    finalHoleNumber = holes[0].hole_number;
  }

  // 3) calculate totals
  const subtotal = lineItems.reduce(
    (acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity,
    0
  );
  const convenienceFee = 2.5;
  const gst = (subtotal + convenienceFee) * 0.05;
  const qst = (subtotal + convenienceFee) * 0.09975;
  const total = subtotal + convenienceFee + gst + qst;

  // 4) send everything to your Supabase Edge Function
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        course_id: courseId,
        notes,
        hole_number: finalHoleNumber,
        subtotal_price: subtotal.toFixed(2),
        convenience_fee: convenienceFee.toFixed(2),
        gst: gst.toFixed(2),
        qst: qst.toFixed(2),
        total_price: total.toFixed(2),
        ordered_items: JSON.stringify(
          lineItems.map((item) => ({
            item_name: item.price_data.product_data.name,
            quantity: item.quantity,
            price: item.price_data.unit_amount / 100,
          }))
        ),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create Stripe Checkout session');
  }

  const session = await response.json();
  return session;
}
