import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRecord, updateRecord, TABLES } from './_lib/airtable';

// NOTE: county / state / acres / zoning etc. are lookups on the Marketing table
// (pulled from the linked Property), so they're managed in Airtable, not here.
// This endpoint edits the listing's own fields: title, description, pricing,
// status, and photo. Primary listing management still lives in Airtable.
function statusToListing(s?: string): string {
  if (s === 'Sold') return 'Sold';
  return 'Active — Live';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (process.env.ADMIN_WRITES !== 'true') {
      return res.status(403).json({
        error: 'Admin editing is disabled. Set ADMIN_WRITES=true to enable, or manage listings in Airtable.',
      });
    }
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const fields: Record<string, any> = {
      'Property Title': input.title,
      'Property Description': input.description,
      'Cash Price': Number(input.cashPrice) || 0,
      'Monthly Payment': Number(input.monthlyPayment) || 0,
      'Down Payment': Number(input.downPayment) || 0,
      'Listing Status': statusToListing(input.status),
    };
    if (input.imageUrl) fields['Photos'] = input.imageUrl;

    if (input.id) {
      const rec = await updateRecord(TABLES.MARKETING, input.id, fields);
      return res.status(200).json({ success: true, id: rec.id });
    }
    const created = await createRecord(TABLES.MARKETING, fields);
    res.status(200).json({ success: true, id: created.id });
  } catch (err: any) {
    console.error('upsertProperty error:', err);
    res.status(500).json({ error: err?.message || 'Failed to save property' });
  }
}
