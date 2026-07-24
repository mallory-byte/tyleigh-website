import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRecord } from './_lib/airtable';

// Optional: set AIRTABLE_RESERVATIONS_TABLE to capture website reservations in a
// dedicated table (recommended over writing into your live Leads/CRM, which has
// automations). If unset, the reservation still proceeds to Stripe checkout.
const RES_TABLE = process.env.AIRTABLE_RESERVATIONS_TABLE || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    let leadId = '';
    if (RES_TABLE) {
      const rec = await createRecord(RES_TABLE, {
        'Full Name': input.fullName,
        Email: input.email,
        Phone: input.phone,
        'Purchase Type': input.purchaseType === 'finance' ? 'Owner Finance' : 'Cash Purchase',
        'Property ID': input.propertyId,
        Status: 'New',
      });
      leadId = rec.id;
    } else {
      console.log('Reservation lead (no AIRTABLE_RESERVATIONS_TABLE set):', input);
    }
    res.status(200).json({ success: true, leadId });
  } catch (err: any) {
    console.error('saveLead error:', err);
    res.status(200).json({ success: true, leadId: '' });
  }
}
