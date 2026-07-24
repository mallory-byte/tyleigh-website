import type { VercelRequest, VercelResponse } from '@vercel/node';

const DOC_FEE = Number(process.env.DOC_FEE || 249);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.ZITE_STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not set');

    // Prefer an explicit APP_URL; otherwise derive from the incoming request.
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const appUrl = (process.env.APP_URL || `${proto}://${host}`).replace(/\/$/, '');

    const lineItems: any[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Document Fee',
            description: `Land reservation document fee for ${input.propertyTitle}`,
          },
          unit_amount: DOC_FEE * 100,
        },
        quantity: 1,
      },
    ];

    if (input.paymentType === 'finance') {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Down Payment',
            description: `Owner financing down payment for ${input.propertyTitle}`,
          },
          unit_amount: Math.round(Number(input.downPayment) * 100),
        },
        quantity: 1,
      });
    } else {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Cash Purchase – Full Price',
            description: `Full cash purchase price for ${input.propertyTitle}`,
          },
          unit_amount: Math.round(Number(input.cashPrice) * 100),
        },
        quantity: 1,
      });
    }

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('success_url', `${appUrl}/property/${input.propertyId}?payment=success`);
    params.append('cancel_url', `${appUrl}/property/${input.propertyId}?payment=cancelled`);
    if (input.customerEmail) params.append('customer_email', input.customerEmail);
    params.append('metadata[propertyId]', input.propertyId || '');
    params.append('metadata[propertyTitle]', input.propertyTitle || '');
    params.append('metadata[paymentType]', input.paymentType || '');
    params.append('metadata[customerName]', input.customerName || '');
    params.append('metadata[customerPhone]', input.customerPhone || '');

    lineItems.forEach((item, i) => {
      params.append(`line_items[${i}][price_data][currency]`, item.price_data.currency);
      params.append(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name);
      if (item.price_data.product_data.description) {
        params.append(
          `line_items[${i}][price_data][product_data][description]`,
          item.price_data.product_data.description,
        );
      }
      params.append(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount));
      params.append(`line_items[${i}][quantity]`, String(item.quantity));
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = (await response.json()) as { url?: string; error?: { message: string } };
    if (!response.ok || !session.url) {
      throw new Error(session.error?.message || 'Failed to create checkout session');
    }

    res.status(200).json({ checkoutUrl: session.url });
  } catch (err: any) {
    console.error('createCheckoutSession error:', err);
    res.status(500).json({ error: err?.message || 'Failed to create checkout session' });
  }
}
