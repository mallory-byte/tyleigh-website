# Ty-Leigh Capital Land Co. — Shopify Theme

A custom [Shopify Online Store 2.0](https://shopify.dev/docs/themes) theme for selling **owner-financed land**, matching the Ty-Leigh Capital brand: deep-teal + orange, Playfair Display headings, and an owner-financing pricing model (monthly payment, down payment, cash price).

Land parcels are Shopify **products**; land-specific data comes from **product metafields**. Buyers browse and filter by state, search, view rich property pages, and reserve/checkout through Shopify.

This repo is built for Shopify's **GitHub integration** — connect it to a store and every push syncs.

---

## 1. Connect the repo to Shopify

1. Shopify admin → **Online Store → Themes**.
2. **Add theme → Connect from GitHub**, authorize, and select `mallory-byte/tyleigh-website`.
3. Choose the branch (e.g. `main` for production).
4. **Preview**, then **Publish**.

Docs: [Shopify ↔ GitHub](https://shopify.dev/docs/storefronts/themes/tools/github)

---

## 2. Set up property data (metafields)

Each property is a **product**. Set the product **price** to the **cash price**, add **images** for the gallery, then create these metafields in **Settings → Custom data → Products** (namespace.key = `custom.*`):

| Metafield (`custom.`)  | Type              | Used for                                   |
| ---------------------- | ----------------- | ------------------------------------------ |
| `state`                | Single line text  | Location label, filter, map                |
| `county`               | Single line text  | Location label                             |
| `acres`                | Decimal           | Acreage badge, specs                       |
| `monthly_payment`      | Integer           | "$X/mo" owner-financing price              |
| `down_payment`         | Integer           | "$Y down" + purchase panel                 |
| `status`               | Single line text  | Badge: `available`, `pending`, or `sold`   |
| `features`             | List of single-line text | Feature tags on the card             |
| `parcel_number`        | Single line text  | Parcel / APN                               |
| `legal_description`    | Multi-line text   | Property Information                        |
| `access`               | Single line text  | Feature tile (road access)                 |
| `power`                | Single line text  | Feature tile                               |
| `water`                | Single line text  | Feature tile                               |
| `septic`               | Single line text  | Feature tile                               |
| `zoning`               | Single line text  | Feature tile                               |
| `elevation`            | Single line text  | Feature tile                               |
| `latitude`             | Decimal           | Coordinates tile                           |
| `longitude`            | Decimal           | Coordinates tile                           |
| `doc_fee`              | Integer           | Per-property document fee (default $249)    |

Every field is optional — the theme only renders what's present. If `status` is empty, the theme shows **available** when the product is in stock and **sold** when it's out of stock.

> **Pricing model note.** The card and property page display owner financing (`$monthly/mo`, `$down` down) alongside the **cash price** (the product price). The **Reserve This Property** button adds the product to the cart and goes to Shopify checkout, which charges the **product price**. Decide what checkout should collect and set the product price accordingly — e.g. set it to the cash price for cash sales, or create a dedicated reservation/deposit product if you want to collect only the down payment + document fee online and handle financing offline.

---

## 3. Turn on state filtering

The listings page (`/collections/...`) renders state filter pills from **Shopify's native storefront filters**:

1. Install the free **[Search & Discovery](https://apps.shopify.com/search-and-discovery)** app.
2. **Filters** → add a filter on **Metafield → `custom.state`**, labelled "State" (add Price / `custom.acres` if you like).
3. Save — the pills appear automatically. Keyword search and the state quick-links on the homepage work without any setup.

---

## 4. Navigation & pages

**Main menu** (`main-menu`) — build a nested menu to get the dropdowns:
- Home → `/`
- **Listings** (dropdown) → All Land `/collections/all`, then a child per state (link to a state collection or `/search?q=Arizona&type=product`)
- **How It Works** (dropdown) → Buying Process, FAQ, Title / Escrow, Financing Info, Our Guarantee, Referral Program
- About → `/pages/about`
- Contact → `/pages/contact`

**Footer menu** (`footer`) — Browse Listings, How It Works, About, Contact, etc.

**Pages** — create each in **Online Store → Pages** and set its **Theme template** to the matching template:

| Page             | Handle           | Template            |
| ---------------- | ---------------- | ------------------- |
| About            | `about`          | `page.about`        |
| Contact          | `contact`        | `page.contact`      |
| FAQ              | `faq`            | `page.faq`          |
| Buying Process   | `buying-process` | `page.buying-process` |
| Title / Escrow   | `title-escrow`   | `page.title-escrow` |
| Financing Info   | `financing-info` | `page.financing-info` |
| Our Guarantee    | `our-guarantee`  | `page.our-guarantee` |
| Referral Program | `referral`       | `page.referral`     |

The About, FAQ, and How-It-Works pages come pre-filled with Ty-Leigh copy in the template JSON — you can edit everything in the theme editor.

---

## 5. Brand & styling

Editable in the theme editor (**Customize**) or `config/settings_schema.json`:
- **Brand** — name, suffix, logo (defaults to the Ty-Leigh horizontal logo URL), tagline, phone.
- **Colors** — deep teal primary, orange accent, backgrounds, borders.
- **Typography** — Playfair Display + Inter (loaded from Google Fonts).
- **Product cards** — toggle status / acreage / location / feature / monthly-price.
- **Contact** — email, phone, business hours, social links.

Homepage sections (hero, listings, property map, how-it-works, why-us, contact) are drag-and-drop editable.

---

## Theme structure

```
assets/     base.css (design system), theme.js
config/     settings_schema.json, settings_data.json
layout/     theme.liquid, password.liquid
locales/    en.default.json
sections/   header/footer groups, hero, featured-parcels (listings), map,
            how-it-works, why-us, contact-section, main-* page sections,
            page-hero, prose, compare, cta-band, faq, value-props, media-text
snippets/   parcel-card, price, pagination, icon, meta-tags
templates/  JSON templates + customer, gift card, password templates
```

## Local development (optional)

```bash
shopify theme dev --store your-store.myshopify.com   # live preview
shopify theme check                                  # lint before pushing
```
