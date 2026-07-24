import type { VercelRequest, VercelResponse } from '@vercel/node';
import { deleteRecord, TABLES } from './_lib/airtable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (process.env.ADMIN_WRITES !== 'true') {
      return res.status(403).json({
        error: 'Admin editing is disabled. Set ADMIN_WRITES=true to enable, or manage listings in Airtable.',
      });
    }
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    if (!input.id) throw new Error('Missing property id');
    await deleteRecord(TABLES.MARKETING, input.id);
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('deleteProperty error:', err);
    res.status(500).json({ error: err?.message || 'Failed to delete property' });
  }
}
