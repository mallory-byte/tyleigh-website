# Ty-Leigh Capital Land Co. — Website

The Ty-Leigh Capital land site, self-hosted. It's the **exact export design** (React + Vite + Tailwind), now wired to your **live Airtable** for listings and **Stripe** for reserve/checkout — so editing Airtable updates the site, and you own the whole thing.

- **Listings** come live from Airtable → *Ty-Leigh Capital - Current* → **Marketing** table (status **Active — Live**).
- Paired lots merge into one listing via the **Listing Group** field.
- **Reserve** buttons create a real **Stripe Checkout** session ($249 doc fee + down payment or cash price).
- Deploys to **Vercel** (free tier, your account, your domain).

> The previous Shopify theme is preserved under [`shopify-theme/`](./shopify-theme) — not used by this app.

---

## Deploy in ~10 minutes

### 1. Get your keys
- **Airtable token** — create a Personal Access Token at <https://airtable.com/create/tokens> with scopes `data.records:read` and `data.records:write`, and access to the *Ty-Leigh Capital - Current* base. Copy the token (starts with `pat...`).
- **Stripe secret key** — <https://dashboard.stripe.com/apikeys> → "Secret key" (`sk_live_...` for real payments, `sk_test_...` to test first).

### 2. Import to Vercel
1. Go to <https://vercel.com> → **Add New → Project** → import `mallory-byte/tyleigh-website` (branch `claude/land-company-website-rrwa8x`).
2. Vercel auto-detects **Vite**. Leave build settings as-is (build `npm run build`, output `dist`).
3. Add **Environment Variables** (from `.env.example`):
   | Name | Value |
   |---|---|
   | `AIRTABLE_TOKEN` | your `pat...` token |
   | `STRIPE_SECRET_KEY` | your `sk_...` key |
   | `AIRTABLE_BASE_ID` | `appjkXCrCh5S0E1YW` (default, optional) |
   | `AIRTABLE_MARKETING_TABLE` | `tblRNpnPT4XONSkTw` (default, optional) |
4. **Deploy.** When it finishes, open the URL — your listings load from Airtable.
5. **Add your domain** — Project → Settings → Domains → add `tyleighcapital.com` (Vercel shows the DNS records to set).

That's it. Every push to the branch redeploys; edits in Airtable show up on the site (cached ~briefly, then live).

---

## How your Airtable maps to the site

Each **Active — Live** row in the *Marketing* table becomes a listing:

| Site | Airtable (Marketing) |
|---|---|
| Price / mo / down | Cash Price · Monthly Payment · Down Payment |
| Acreage, county, state | Size / County / State (from linked Property) |
| Specs | APN · Zoning · Access · Water · Legal Description · Coordinates |
| Description | Property Description |
| Merge paired lots | **Listing Group** (same tag on both rows → one listing) |
| Title | auto-generated (e.g. "0.45 Acres in Pueblo County, Colorado") |

**To change the site, edit Airtable.** Mark a row **Sold** (or anything other than *Active — Live*) and it drops off automatically.

### Photos
Real photos aren't in Airtable yet, so the site uses tasteful land imagery. To use real ones, put a **direct image URL** (ending in `.jpg`/`.png`) in the Marketing **Photos** field — the site will use it. (Google Drive *folder* links won't work; they aren't images.)

---

## Optional extras

- **Capture form submissions** — create two simple tables and set `AIRTABLE_CONTACT_TABLE` / `AIRTABLE_RESERVATIONS_TABLE` to their table IDs. Left blank, forms still work (submissions are logged in Vercel).
- **/admin editing** — off by default for safety. Set `ADMIN_WRITES=true` to let the built-in `/admin` page edit listing pricing/status in Airtable. (Protect the URL — Vercel → Settings → Deployment Protection.)
- **Doc fee** — defaults to `$249`; override with `DOC_FEE`.

---

## Local development

```bash
npm install
cp .env.example .env        # fill in AIRTABLE_TOKEN + STRIPE_SECRET_KEY
npx vercel dev              # runs the app + /api functions locally
```

(`npm run dev` runs just the frontend; use `vercel dev` to exercise the Airtable/Stripe API routes.)

## Structure

```
api/                serverless functions (Airtable + Stripe) — replaces the Zite backend
  _lib/airtable.ts  Marketing → Property mapping + Listing Group merge
src/                the exact export frontend (components, pages, styles)
  lib/sdk.ts        client for the /api functions (aliased as `zite-endpoints-sdk`)
shopify-theme/      the old Shopify theme (archived, unused)
```
