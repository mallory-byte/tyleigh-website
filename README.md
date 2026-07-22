# Tyleigh Capital — Shopify Theme

A custom [Shopify Online Store 2.0](https://shopify.dev/docs/themes) theme for selling **land parcels**. Buyers can browse and filter parcels by **state, acreage, and price**, search by keyword, view rich parcel detail pages (specs, financing, maps), and check out — all managed through Shopify.

This repository is designed to be connected directly to a Shopify store through Shopify's **GitHub integration**, so every push to the theme branch updates the store.

---

## 1. Connect the repo to Shopify

1. In Shopify admin, go to **Online Store → Themes**.
2. Click **Add theme → Connect from GitHub**.
3. Authorize GitHub and select the `mallory-byte/tyleigh-website` repository.
4. Choose the branch to connect (e.g. `main` for production).
5. Shopify pulls the theme. **Preview** it, then **Publish** when ready.

> Every commit pushed to the connected branch syncs automatically. Edits made in the Shopify theme editor are committed back to the branch.

Docs: [Shopify ↔ GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github)

---

## 2. Set up parcel data (metafields)

Each parcel is a **Shopify product**. Land-specific details live in **product metafields** in the `custom` namespace. Create these once in **Settings → Custom data → Products**:

| Metafield (namespace.key)      | Type              | Shows up as / used for            |
| ------------------------------ | ----------------- | --------------------------------- |
| `custom.acreage`               | Decimal           | Acreage badge, spec, filter       |
| `custom.state`                 | Single line text  | Location label, spec, filter      |
| `custom.county`                | Single line text  | Location label, spec              |
| `custom.apn`                   | Single line text  | Parcel / APN number spec          |
| `custom.zoning`                | Single line text  | Zoning spec                       |
| `custom.road_access`           | Single line text  | Road access spec                  |
| `custom.utilities`             | Single line text  | Utilities spec                    |
| `custom.financing_available`   | True / false      | "Financing" badge + trust row     |
| `custom.financing_terms`       | Single line text  | Financing note on parcel page     |
| `custom.map_embed_url`         | URL               | Embedded map (Google Maps embed)  |
| `custom.latitude`              | Decimal           | Map fallback (with longitude)     |
| `custom.longitude`             | Decimal           | Map fallback (with latitude)      |

Every field is optional — the theme only renders what's present, so nothing breaks if a parcel is missing data. Set the standard product **price** as the parcel price, use the product **type** for a category label (e.g. "Recreational"), and add product **images** for the gallery.

### Recommended product setup for a parcel
- **Title** — e.g. "5 Acres in Costilla County, Colorado"
- **Price** — the cash price
- **Media** — parcel photos, plat maps, aerials
- **Type** — a short category (used as a tag on cards)
- **Metafields** — the `custom.*` fields above

---

## 3. Turn on filtering (state / acreage / price)

The listings and search pages render **Shopify's native storefront filters**. To enable the recommended filters:

1. Install the free **[Search & Discovery](https://apps.shopify.com/search-and-discovery)** app from Shopify.
2. Open it → **Filters**.
3. Add filters for:
   - **Price** (built in)
   - **Metafield → `custom.state`** → label it "State"
   - **Metafield → `custom.acreage`** → label it "Acreage"
   - **Metafield → `custom.financing_available`** → label it "Financing"
4. Save. The filter sidebar on collection and search pages populates automatically.

> Tip: for acreage you can present it as ranges (0–1, 1–5, 5–20, 20+) inside the Search & Discovery app.

---

## 4. Set up navigation & pages

**Navigation** (Online Store → Navigation):
- **Main menu** (`main-menu`): Home, Browse Land (link to a collection or `/collections/all`), Financing, About, Contact.
- **Footer menu** (`footer`): About, Financing, FAQ, Contact, etc.

**Pages** (Online Store → Pages) — create these and assign the matching theme template in the page's **Theme template** dropdown:
| Page    | Handle      | Template to assign      |
| ------- | ----------- | ----------------------- |
| Contact | `contact`   | `page.contact`          |
| About   | `about`     | `page.about`            |
| Financing | `financing` | `page.financing`      |

Any other page uses the default `page` template.

---

## 5. Customize the look

Everything visual is editable in the **theme editor** (Customize) or in `config/settings_schema.json`:
- **Brand** — name, logo, tagline, favicon
- **Colors** — primary green, gold accent, backgrounds, borders
- **Typography** — heading & body fonts
- **Layout** — max width, corner radius
- **Product cards** — toggle acreage / location / financing badges
- **Social & contact** — email, phone, social links

Homepage sections (hero, value props, featured parcels, how-it-works, testimonials, FAQ, CTA, newsletter) are all drag-and-drop editable in the theme editor.

---

## Theme structure

```
assets/          base.css (design system), theme.js (interactions)
config/          settings_schema.json, settings_data.json
layout/          theme.liquid, password.liquid
locales/         en.default.json
sections/        header/footer, home sections, main-* page sections
snippets/        parcel-card, facets, price, pagination, icon, meta-tags
templates/       JSON templates + customer & gift card templates
```

## Local development (optional)

Use the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) to preview against a live store:

```bash
shopify theme dev --store your-store.myshopify.com
```

Run the theme linter before pushing:

```bash
shopify theme check
```
