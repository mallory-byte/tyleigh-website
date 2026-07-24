import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getActiveProperties } from './_lib/airtable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const state = body?.state as string | undefined;
    const properties = await getActiveProperties(state);
    res.status(200).json({ properties });
  } catch (err: any) {
    console.error('getProperties error:', err);
    res.status(500).json({ error: err?.message || 'Failed to load properties', properties: [] });
  }
}
