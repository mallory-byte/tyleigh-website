import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRecord } from './_lib/airtable';

// Fully-automated Property Finder handler.
// The Shopify storefront POSTs { email, answers, matches } here after the quiz.
// We instantly email the lead their personalized property list, notify the
// owner, and (optionally) log the lead in Airtable.
//
// Required env: RESEND_API_KEY
// Recommended:  FINDER_FROM        e.g. "Ty-Leigh Capital <land@tyleighcapital.com>"
//               LEAD_NOTIFY_EMAIL  where owner notifications go (defaults below)
// Optional:     AIRTABLE_LEADS_TABLE  table id to log leads into

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const FROM = process.env.FINDER_FROM || 'Ty-Leigh Capital <land@tyleighcapital.com>';
const NOTIFY = process.env.LEAD_NOTIFY_EMAIL || 'mallory@tyleighcapital.com';
const LEADS_TABLE = process.env.AIRTABLE_LEADS_TABLE || '';

type Match = {
  title?: string; url?: string; monthly?: string | number; down?: string | number;
  state?: string; county?: string; acres?: string | number; img?: string;
};

function money(v: any) {
  const n = parseFloat(v);
  return isNaN(n) ? '' : '$' + n.toLocaleString();
}

function budgetLabel(b: any) {
  const n = parseFloat(b);
  if (isNaN(n)) return 'any';
  return n >= 99999 ? '$500+/mo' : `up to $${n}/mo`;
}

function cardHtml(m: Match) {
  const loc = [m.county ? `${m.county} County` : '', m.state].filter(Boolean).join(', ');
  const img = m.img
    ? `<img src="${m.img}" width="560" alt="" style="width:100%;max-width:560px;height:auto;border-radius:8px;display:block;margin-bottom:8px">`
    : '';
  return `
    <table role="presentation" width="100%" style="border:1px solid #dbe1e9;border-radius:12px;padding:16px;margin:0 0 14px">
      <tr><td>
        ${img}
        <div style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#042028;margin-bottom:2px">${m.title || 'Property'}</div>
        ${loc ? `<div style="font-size:13px;color:#4b7c86;margin-bottom:8px">${loc}${m.acres ? ` &middot; ${m.acres} acres` : ''}</div>` : ''}
        <div style="font-size:20px;color:#f16522;font-weight:800">${money(m.monthly)}<span style="font-size:13px;color:#4b7c86;font-weight:400">/mo</span>${m.down ? `<span style="font-size:13px;color:#4b7c86;font-weight:400"> &middot; ${money(m.down)} down</span>` : ''}</div>
        ${m.url ? `<a href="${m.url}" style="display:inline-block;margin-top:10px;background:#024e5f;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:9px 16px;border-radius:8px">View this parcel &rarr;</a>` : ''}
      </td></tr>
    </table>`;
}

function leadEmailHtml(matches: Match[], answers: any) {
  const intro = matches.length
    ? `<p style="font-size:16px;color:#042028">Here are the <strong>${matches.length} propert${matches.length === 1 ? 'y' : 'ies'}</strong> that fit your budget of <strong>${budgetLabel(answers?.budget)}</strong>. Every one is owner-financed with <strong>0% interest</strong> — no credit check.</p>`
    : `<p style="font-size:16px;color:#042028">Thanks for your interest! We don't have an exact match for your budget right now, but new owner-financed parcels list every week — you'll be the first to know the moment one fits.</p>`;
  return `<!doctype html><html><body style="margin:0;background:#f3f6fb;padding:24px;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto">
      <tr><td style="padding:0 4px 16px">
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:800;color:#024e5f">Ty-Leigh Capital Land Co.</div>
        <div style="font-size:13px;color:#4b7c86">Your personalized property list</div>
      </td></tr>
      <tr><td style="background:#fff;border-radius:12px;padding:24px">
        ${intro}
        ${matches.map(cardHtml).join('')}
        <p style="font-size:14px;color:#4b7c86;margin-top:20px">Questions? Just reply to this email or call/text <a href="tel:6624424362" style="color:#024e5f">(662) 442-4362</a> — you'll reach me directly.</p>
      </td></tr>
      <tr><td style="padding:16px 4px;font-size:12px;color:#4b7c86">Ty-Leigh Capital Land Co. &middot; You asked us to send matching properties. Reply STOP to opt out.</td></tr>
    </table>
  </body></html>`;
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return r.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — the Shopify storefront is a different origin.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const email: string = (body.email || '').trim();
    const answers = body.answers || {};
    const matches: Match[] = Array.isArray(body.matches) ? body.matches.slice(0, 30) : [];

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Valid email required' });
    }
    if (!RESEND_KEY) {
      console.error('RESEND_API_KEY not set — cannot send finder emails.');
      return res.status(200).json({ ok: true, emailed: false });
    }

    // 1) Personalized list to the lead.
    await sendEmail(
      email,
      matches.length ? `${matches.length} propert${matches.length === 1 ? 'y' : 'ies'} that fit your budget` : `Your Ty-Leigh Capital property list`,
      leadEmailHtml(matches, answers),
      NOTIFY,
    );

    // 2) Notify the owner of the new lead.
    const crit = `Budget ${budgetLabel(answers?.budget)}, down ${answers?.down === 99999 ? '$1,000+' : money(answers?.down) || 'any'}, area ${answers?.state || 'Anywhere'}`;
    await sendEmail(
      NOTIFY,
      `🔔 New land lead: ${email}`,
      `<p style="font-family:Arial,sans-serif">New Property Finder lead.</p>
       <p style="font-family:Arial,sans-serif"><strong>Email:</strong> ${email}<br><strong>Criteria:</strong> ${crit}<br><strong>Matches sent:</strong> ${matches.length}</p>`,
      email,
    ).catch((e) => console.error('owner notify failed:', e));

    // 3) Optional: log the lead in Airtable.
    if (LEADS_TABLE) {
      await createRecord(LEADS_TABLE, {
        Email: email,
        Criteria: crit,
        'Matches Sent': matches.length,
        Source: 'Property Finder',
        Status: 'New',
      }).catch((e) => console.error('airtable lead log failed:', e));
    }

    return res.status(200).json({ ok: true, emailed: true, count: matches.length });
  } catch (err: any) {
    console.error('finder error:', err);
    return res.status(500).json({ ok: false, error: 'Could not send. Please try again.' });
  }
}
