# Life Admin

**Open it:** https://hmwolf10-ux.github.io/life-admin/

The small recurring stuff, in one place: a daily and weekly routine checklist, a stock list of the products you run out of, car upkeep with service intervals, and short how-to guides for paperwork.

**On your phone:** open the link in Safari, tap Share, then Add to Home Screen. It opens like an app and works offline.

## What it does

| Tab | What it does |
|---|---|
| **Today** | Morning, evening, and weekly checklists. Daily items reset each day and weekly items reset Monday. Shows what needs restocking and which car items are due. Edit, reorder, or add steps with **Edit**. |
| **Stock** | Products you keep on hand. Tap the status to cycle Have it, Running low, Out. Anything low or out gets a **Reorder** link (your own link, or a shopping search) and floats to the top. |
| **Car** | Odometer, a maintenance list with Not logged, OK, Due soon, or Overdue, service history, and a card for your plate, VIN, insurance, and loan details. Log a service and its next due mileage and date are worked out from the interval. |
| **Guides** | Check handling, mail prep, and what paperwork to keep and for how long. |
| **Settings** | Light or Dark appearance, service intervals, backup and restore. |

## Your data

Everything you enter (routines, stock, vehicle details, service history) lives in this browser on this device. Nothing is uploaded and there is no account. The repo ships only generic starting content, with no names, VINs, plates, or account numbers. Use **Settings, Download Backup** before clearing Safari data or switching phones. Storage keys all start with `adm.` because every app on this GitHub Pages site shares one browser origin.

## How due dates work

Each interval has miles, months, or both (0 ignores one). Service is **Due soon** under 1,000 miles or 30 days from its limit, and **Overdue** once either limit passes. The defaults are typical values; change them in Settings to match your owner's manual.

## Folder layout

```
index.html                 app shell
src/app.js                 screens
src/engine.js              pure logic: dates, weekly reset, service-due status (tested)
src/defaults.js            starting routines, stock, and service intervals
src/guides.js              the how-to guides
src/ui.js                  shared helpers (storage, theme, router, sheet, backup)
src/base.css, app.css      look (tokens are CSS variables; Light/Dark)
tests/engine.test.mjs      tests for the date and due logic
sw.js, manifest.webmanifest, icons/    install and offline support
```

## Run it locally

It is plain HTML and ES modules with no build step, so serve the folder with any static server:

```
python -m http.server 8080
```

then open http://localhost:8080. Tests use Node's built-in runner:

```
npm test
```

Deploy by enabling GitHub Pages on `main` (root folder).

## Notes

General guidance only, not legal, tax, or medical advice.
