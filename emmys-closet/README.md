# Emmy's Closet — Shopify Theme

A Shopify Online Store 2.0 theme for **Emmy's Closet**, a classic children's
clothing boutique. The look is soft and whimsical — dusty rose + warm cream,
Fraunces headings, Nunito Sans body — inspired by timeless smocked &
monogrammed children's wear (à la Classic Whimsy).

This folder **is** the theme root, so it can be pushed straight to Shopify with
the Shopify CLI or GitHub integration.

## Installing / previewing

```bash
# from this folder
shopify theme dev      # local preview against a dev store
shopify theme push     # push to a store as an unpublished theme
```

(Requires the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) and a
store you have access to.)

## What's here

```
layout/        theme.liquid, password.liquid
sections/      homepage + page sections (hero, featured-collections,
               featured-products, value-props, media-text, testimonials,
               newsletter, header, footer, announcement-bar, popup, …)
snippets/      product-card, icon, meta-tags, pagination
templates/     index, product, collection, cart, search, blog, article,
               page + page.about / page.contact / page.faq, customers/*
config/        settings_schema.json (theme editor) + settings_data.json (skin)
assets/        base.css, theme.js
locales/       en.default.json
```

## Homepage sections (theme editor)

Home (`templates/index.json`) is arranged as:

1. **Hero** — full-bleed image, eyebrow, headline, perks, two CTAs
2. **Shop by category** (`featured-collections`) — 4 category cards
3. **New Arrivals** (`featured-products`) — product grid from a collection
4. **The Emmy's Closet Promise** (`value-props`) — 4 perk cards
5. **Our Story** (`media-text`) — image + copy
6. **Best Sellers** (`featured-products`)
7. **Testimonials**
8. **Newsletter**

## Setup notes for the merchant

- **Collections**: In the theme editor, point the *Shop by category* blocks and
  the *Featured products* sections at real collections (e.g. `girls`, `boys`,
  `baby`, `accessories`, `new`, `best-sellers`).
- **Navigation**: Create a `main-menu` and `footer` link list in
  *Online Store → Navigation*.
- **Brand & colors**: Everything is editable under *Theme settings*
  (Brand, Colors, Typography, Layout, Product cards, Social & contact).
- **Product cards** read standard product data — price, `compare_at_price`
  (shows a *Sale* badge), `created_at` (shows a *New* badge), a second image
  (revealed on hover), and any option named *Color* (shown as swatches).
- **Placeholder imagery** on the homepage uses Unsplash URLs — replace them with
  your own product/lifestyle photos.

## Design tokens

| Token | Value | Role |
|-------|-------|------|
| `color_primary` | `#9a6a72` | Dusty rose — buttons, links |
| `color_primary_dark` | `#4e2f36` | Deep plum — footer |
| `color_accent` | `#b8737d` | Rose — prices, badges, CTAs |
| `color_bg` | `#faf5f0` | Warm cream page background |
| `color_text` | `#40353a` | Warm charcoal body text |

Fonts: **Fraunces** (headings) + **Nunito Sans** (body), from Google Fonts.
