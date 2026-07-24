import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRecord } from './_lib/airtable';

// Optional: set AIRTABLE_CONTACT_TABLE to a table id (e.g. a "Website Contact
// Messages" table) to capture submissions. If unset, the form still works and
// we simply skip the write (so we never touch your operational CRM by accident).
const CONTACT_TABLE = process.env.AIRTABLE_CONTACT_TABLE || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    if (CONTACT_TABLE) {
      await createRecord(CONTACT_TABLE, {
        Name: input.name,
        Email: input.email,
        Phone: input.phone || '',
        Message: input.message,
        Status: 'New',
      });
    } else {
      console.log('Contact message (no AIRTABLE_CONTACT_TABLE set):', input);
    }
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('saveContactMessage error:', err);
    // Don't fail the user's submission on a logging hiccup.
    res.status(200).json({ success: true });
  }
}
