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

## Changing an animal's name, price, or details

Those live in **`assets/data.js`**. You can edit that file right on GitHub too
— each animal is one line. Change the words between the quotes, commit, done.
