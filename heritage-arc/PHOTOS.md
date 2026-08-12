# Changing the photos — no code, no help needed

Every picture on the site is a **file in the `images` folder**. To change any
photo, you upload your own picture with the **same filename**. That's it — the
website updates itself a minute later.

## How to swap a photo (about 60 seconds)

1. Go to your project on **github.com** and open the **`images`** folder.
2. Click **Add file → Upload files**.
3. Drag in your photo, renamed to match the one you want to replace (see the
   list below). For example, to change the big top picture, name your file
   **`hero.jpg`**.
4. Click **Commit changes**.
5. Wait about a minute — your live site shows the new photo automatically.

> Tip: photos look best saved as **`.jpg`**, roughly **1600 pixels wide** or
> more. Landscape (wide) shots work best for the big banners.

## Which filename is which picture

Put these in the **`images`** folder:

| Filename | Where it shows up |
|---|---|
| `hero.jpg` | The big banner on the home page (misty valley) |
| `philosophy.jpg` | The photo in the "Philosophy" section |
| `cattle.jpg` | The cattle photo (home + Cattle page) |
| `cattle-wide.jpg` | Wide banner on the Cattle / Available pages |
| `sheep.jpg` | The sheep photo (home + Sheep page) |
| `goats.jpg` | The goat photo (home + Goats page) |
| `ranch.jpg` | The "Visit Us" pictures |
| `herd.jpg` | Banner on the Inquire page |

Put these in the **`images/animals`** folder (one per animal, named after it):

| Filename | Animal |
|---|---|
| `evergreen.jpg` | Evergreen |
| `magnolia.jpg` | Magnolia |
| `cedar.jpg` | Cedar |
| `juniper.jpg` | Juniper |
| `willow.jpg` | Willow |
| `bramble.jpg` | Bramble |
| `fern.jpg` | Fern |
| `clover.jpg` | Clover |
| `hazel.jpg` | Hazel |
| `sage.jpg` | Sage |

## What happens before you add your own

Until you upload a file, that spot shows a tasteful **stock photo**
automatically, and if that ever fails, a clean monogram panel — so the site
never looks broken or empty while you're swapping things around.

## Editing, adding, or removing animals

All the animals live in one file: **`assets/data.js`** — one line each. You can
edit it right on GitHub (open the file, click the pencil ✏️, make changes,
**Commit changes**). A new or edited animal shows up automatically on its
species page, and on Available Stock if its status is `Available` or `Reserved`.

**To change** a name, price, breed, age, weight, status, or description: find
that animal's line and change the words between the quotes.

**To add** an animal: copy one existing line, paste it as a new line in the
list, and change the values. Keep the quotes and the comma at the end of each
line. A copy-paste template is written at the top of the animal list in the
file. The important fields:

- `slug` — a lowercase nickname with no spaces (e.g. `rosie`). This is also the
  animal's **photo filename**: upload `images/animals/rosie.jpg`.
- `species` — must be exactly `cattle`, `sheep`, or `goats`.
- `status` — `Available`, `Reserved`, or `Sold`.

Example of a line to add:

    { slug:'rosie', name:'Rosie', species:'cattle', breed:'Hereford', id:'CT-041', sex:'Cow', age:'3 yr', weight:'1,300 lb', status:'Available', desc:'A quiet, deep-bodied young cow.' },

**To remove** an animal: delete its whole line.

> One tip: every line except the last one ends with a comma. If the site ever
> goes blank after an edit, it's almost always a missing comma or a missing
> quote — undo that commit on GitHub and try again.
