/**
 * Shared Airtable helpers for the serverless API.
 * Files under /api/_lib are NOT routed by Vercel — they're imported by the
 * endpoint functions in /api.
 */

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appjkXCrCh5S0E1YW';
const MARKETING_TABLE = process.env.AIRTABLE_MARKETING_TABLE || 'tblRNpnPT4XONSkTw';
const TOKEN = process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY || '';
const ACTIVE_STATUS = process.env.AIRTABLE_ACTIVE_STATUS || 'Active — Live';

// Field IDs in the Marketing table (stable across renames).
const F = {
  status: 'fld3pm3JuxArEGKrO',
  group: 'fld6trJSTjEph5tvz',
  cashPrice: 'fldS9PA6R4NnfDKUL',
  monthly: 'fld6pQBwXuaxcoH6J',
  down: 'fldW81AfNuphLbofq',
  term: 'fld4z3HDbzEwsiRvX',
  description: 'fldHjZSTGBQC0EZUx',
  title: 'fldY8B1kcNqwb9eYI',
  photos: 'fldcg32joXmWb3v0h',
  size: 'fld9VSbDX4VeFzjF1',
  county: 'fldf4CeY5xIY0pKlN',
  state: 'fldjFJqbICJs9mzUV',
  apn: 'fldK5SCPql0j3EcNv',
  zoning: 'fldhiSYqxtwydTzNa',
  access: 'fldYU5NaeFH0OsAno',
  water: 'fldfjtmGCpJGLGNan',
  legal: 'fldRFhN6JJorGTB27',
  coords: 'fldLP3L8PBhgIaGWG',
  maps: 'fldxCpqKjQZ66cPhO',
};

export type Property = {
  id: string;
  title: string;
  state: string;
  county: string;
  acres: number;
  cashPrice: number;
  monthlyPayment: number;
  downPayment: number;
  lat: number;
  lng: number;
  image: string;
  description: string;
  features: string[];
  status: 'available' | 'pending' | 'sold';
  parcelId?: string;
  legalDescription?: string;
  access?: string;
  power?: string;
  water?: string;
  septic?: string;
  zoning?: string;
  elevation?: string;
};

const API = 'https://api.airtable.com/v0';

function authHeaders() {
  if (!TOKEN) throw new Error('AIRTABLE_TOKEN is not set');
  return { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
}

function first<T>(v: T | T[] | undefined | null): T | undefined {
  if (Array.isArray(v)) return v[0];
  return v ?? undefined;
}

// Tasteful stock land imagery, used when a listing has no photo URL yet.
const STOCK = [
  'photo-1500382017468-9049fed747ef',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1506905925346-21bda4d32df4',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1501785888041-af3ef285b470',
  'photo-1472396961693-142e6e269027',
  'photo-1441974231531-c6227db76b6e',
  'photo-1518495973542-4542c06a5843',
];
function stockImage(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const id = STOCK[h % STOCK.length];
  return `https://images.unsplash.com/${id}?w=1200&auto=format&fit=crop`;
}

function pickImage(photos: string | undefined, seed: string): string {
  if (photos && /^https?:\/\/\S+\.(jpg|jpeg|png|webp)/i.test(photos.trim())) {
    return photos.trim().split(/[\s,]+/)[0];
  }
  return stockImage(seed);
}

function deriveFeatures(p: { description: string; access?: string; water?: string; zoning?: string }): string[] {
  const feats: string[] = [];
  const desc = (p.description || '').toLowerCase();
  const access = (p.access || '').toLowerCase();
  if (/paved/.test(access)) feats.push('Paved Road Access');
  else if (access) feats.push('Road Access');
  if (/no hoa/.test(desc)) feats.push('No HOA');
  if (/reservoir|lake|river|golf|park|mountain|views?/.test(desc)) feats.push('Great Location');
  if (/available/i.test(p.water || '') || /utilit/.test(desc)) feats.push('Utilities Nearby');
  feats.push('Owner Financing');
  return Array.from(new Set(feats)).slice(0, 4);
}

function formatAcres(n: number): string {
  if (!n) return '0';
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

function parseCoords(v: string | undefined): { lat: number; lng: number } {
  if (!v) return { lat: 0, lng: 0 };
  const parts = String(v).split(',').map((s) => parseFloat(s.trim()));
  return { lat: parts[0] || 0, lng: parts[1] || 0 };
}

type RawRecord = { id: string; fields: Record<string, any> };

async function fetchAllActive(): Promise<RawRecord[]> {
  const formula = `{Listing Status}='${ACTIVE_STATUS}'`;
  let url =
    `${API}/${BASE_ID}/${MARKETING_TABLE}?returnFieldsByFieldId=true&pageSize=100` +
    `&filterByFormula=${encodeURIComponent(formula)}`;
  const out: RawRecord[] = [];
  // paginate (defensive; there are only ~13)
  for (let i = 0; i < 20; i++) {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { records: RawRecord[]; offset?: string };
    out.push(...data.records);
    if (!data.offset) break;
    url =
      `${API}/${BASE_ID}/${MARKETING_TABLE}?returnFieldsByFieldId=true&pageSize=100` +
      `&filterByFormula=${encodeURIComponent(formula)}&offset=${data.offset}`;
  }
  return out;
}

function recToPartial(r: RawRecord) {
  const f = r.fields;
  return {
    id: r.id,
    group: (f[F.group] as string) || '',
    title: (f[F.title] as string) || '',
    description: (f[F.description] as string) || '',
    cashPrice: Number(f[F.cashPrice] || 0),
    monthlyPayment: Number(f[F.monthly] || 0),
    downPayment: Number(f[F.down] || 0),
    acres: Number(first(f[F.size]) || 0),
    county: String(first(f[F.county]) || ''),
    state: String(first(f[F.state]) || ''),
    apn: String(first(f[F.apn]) || ''),
    zoning: String(first(f[F.zoning]) || ''),
    access: String(first(f[F.access]) || ''),
    water: String(first(f[F.water]) || ''),
    legal: String(first(f[F.legal]) || ''),
    coords: String(first(f[F.coords]) || ''),
    photos: (f[F.photos] as string) || '',
  };
}

/** Fetch active listings, merge grouped lots, and map to the Property shape. */
export async function getActiveProperties(stateFilter?: string): Promise<Property[]> {
  const records = (await fetchAllActive()).map(recToPartial);

  // Group by Listing Group; blank group = its own singleton bucket.
  const buckets = new Map<string, typeof records>();
  for (const rec of records) {
    const key = rec.group ? `grp:${rec.group}` : `one:${rec.id}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(rec);
  }

  const properties: Property[] = [];
  for (const group of buckets.values()) {
    // Primary = the priced row (highest cash price), else the first.
    const primary = [...group].sort((a, b) => b.cashPrice - a.cashPrice)[0];
    const acres = group.reduce((sum, g) => sum + (g.acres || 0), 0);
    const apns = group.map((g) => g.apn).filter(Boolean).join(' & ');
    const { lat, lng } = parseCoords(primary.coords);
    const county = primary.county;
    const state = primary.state;
    const title =
      primary.title ||
      `${formatAcres(acres)} Acre${acres === 1 ? '' : 's'} in ${county} County, ${state}`;

    properties.push({
      id: primary.id,
      title,
      state,
      county,
      acres,
      cashPrice: primary.cashPrice,
      monthlyPayment: primary.monthlyPayment,
      downPayment: primary.downPayment,
      lat,
      lng,
      image: pickImage(primary.photos, primary.id),
      description: primary.description,
      features: deriveFeatures(primary),
      status: 'available',
      parcelId: apns || undefined,
      legalDescription: primary.legal || undefined,
      access: primary.access || undefined,
      water: primary.water || undefined,
      zoning: primary.zoning || undefined,
      septic: undefined,
      power: undefined,
      elevation: undefined,
    });
  }

  // Priced first, then by acreage.
  properties.sort((a, b) => (b.cashPrice > 0 ? 1 : 0) - (a.cashPrice > 0 ? 1 : 0) || b.acres - a.acres);

  if (stateFilter && stateFilter !== 'All') {
    return properties.filter((p) => p.state === stateFilter);
  }
  return properties;
}

// ---- Generic write helpers (used by contact / lead / admin endpoints) -------
export async function createRecord(tableId: string, fields: Record<string, any>) {
  const res = await fetch(`${API}/${BASE_ID}/${tableId}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) throw new Error(`Airtable create failed ${res.status}: ${await res.text()}`);
  return (await res.json()) as { id: string };
}

export async function updateRecord(tableId: string, id: string, fields: Record<string, any>) {
  const res = await fetch(`${API}/${BASE_ID}/${tableId}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) throw new Error(`Airtable update failed ${res.status}: ${await res.text()}`);
  return (await res.json()) as { id: string };
}

export async function deleteRecord(tableId: string, id: string) {
  const res = await fetch(`${API}/${BASE_ID}/${tableId}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Airtable delete failed ${res.status}: ${await res.text()}`);
  return (await res.json()) as { deleted: boolean; id: string };
}

export const TABLES = { MARKETING: MARKETING_TABLE };
export const FIELDS = F;
