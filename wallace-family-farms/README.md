# Wallace Family Farms — website

A warm, editorial, multi-page marketing site for a family farm in Fulton, North
Mississippi raising registered Highland cattle. Every path ends at the inquiry
form — it is **not** an e-commerce store (no cart, no checkout).

Fully self-contained static HTML/CSS/JS. No build step, no dependencies. Open
`index.html` in a browser, or host the folder on any static host (Vercel,
Netlify, GitHub Pages, S3).

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, intro, four tiles, featured fold, availability + calving countdown, journal preview, registries, photo-strip footer |
| `highlands.html` | About Highlands (the breed) |
| `fold.html` | Our Fold — all animals grouped: herd sire → cows → heifers & young |
| `animal.html?a=<slug>` | Animal detail — gallery, story, spec table, inquiry button when Available |
| `the-farm.html` | The Farm — the hens, guardian dogs, goats, told as farm life |
| `available.html` | Available Stock — Status = Available or Reserved (warm waitlist state if empty) |
| `reserve.html` | How to Reserve — deposit, updates, pickup/transport |
| `pricing.html` | Pricing & Purchasing |
| `registration.html` | Registration & Papers |
| `calving.html` | Calving Season — with live countdown |
| `sold.html` | Previously Sold — proud track record, "sold" marker |
| `journal.html` / `post.html?p=<slug>` | Notes from the Pasture (blog) |
| `inquire.html` | Inquiry form (name, email, phone, interest, message) |

## Editing content — `assets/data.js`

This file **is** the database. It mirrors the requested `Animals` table schema
exactly, so it maps 1:1 to Airtable later:

`name, barnName, species, sex, registrationNumber, registry, dob, sire, dam,
color, status, price, priceHidden, story, photos[], featured`

- Add or edit an animal → edit the `ANIMALS` array. Every page updates automatically.
- `featured: true` places an animal in the homepage "meet our fold" section.
- `priceHidden: true` keeps a price out of the public spec table.
- Journal posts live in the `JOURNAL` array.
- Farm-wide settings (name, town, phone, email, next calving date, registry) live in `SITE`.

## Photos

The image URLs in `data.js` (`IMG`) are **placeholders** — swap them for real
herd photos. Images render as `background-image`, so a missing photo shows a
warm moss block rather than a broken-image icon.

## Wiring the inquiry form to Airtable + email

The form is self-contained today: on submit it shows a warm confirmation. To make
it deliver, replace the submit handler in `assets/site.js` (`initForm`) with a
`fetch()` POST to a small endpoint that (a) creates a row in an `Inquiries` table
and (b) emails the farm. The animal detail "inquire" buttons already deep-link
with `?about=<Name>` so the form pre-selects what the visitor was looking at.

## Design system

Palette: bone `#FAF6EF` · rust `#A85B37` · moss `#6B7355` · brown `#8A7461` ·
ink `#2E2A26`. Headings in Fraunces (display serif); body in Work Sans (humanist
sans). No rounded pills, drop shadows, gradients, carousels, or bright greens —
by design. All in `assets/styles.css`.
