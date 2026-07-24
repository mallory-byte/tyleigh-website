/**
 * Local stand-in for `zite-endpoints-sdk`.
 *
 * The exported Ty-Leigh site imported all of its backend calls from
 * `zite-endpoints-sdk`. We alias that package name to this file (see
 * vite.config.ts + tsconfig.json), so every component keeps its original
 * import untouched — but the calls now hit our own /api serverless
 * functions, which talk to Airtable + Stripe.
 */

// ---- Types (mirror the export's PropertySchema) ----------------------------
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

export type GetPropertiesOutputType = { properties: Property[] };

// ---- Fetch helper ----------------------------------------------------------
async function callApi<T>(name: string, input: unknown): Promise<T> {
  const res = await fetch(`/api/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.error || data.message)) || `Request to ${name} failed`);
  }
  return data as T;
}

// ---- Endpoint clients (signatures match the export's usage) -----------------
export function getProperties(input: { state?: string } = {}): Promise<GetPropertiesOutputType> {
  return callApi<GetPropertiesOutputType>('getProperties', input);
}

export function createCheckoutSession(input: {
  propertyId: string;
  propertyTitle: string;
  paymentType: 'finance' | 'cash';
  downPayment: number;
  cashPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<{ checkoutUrl: string }> {
  return callApi('createCheckoutSession', input);
}

export function saveContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ success: boolean }> {
  return callApi('saveContactMessage', input);
}

export function saveLead(input: {
  propertyId: string;
  fullName: string;
  email: string;
  phone: string;
  purchaseType: 'finance' | 'cash';
}): Promise<{ success: boolean; leadId: string }> {
  return callApi('saveLead', input);
}

export function upsertProperty(input: Record<string, unknown>): Promise<{ success: boolean; id: string }> {
  return callApi('upsertProperty', input);
}

export function deleteProperty(input: { id: string }): Promise<{ success: boolean }> {
  return callApi('deleteProperty', input);
}
