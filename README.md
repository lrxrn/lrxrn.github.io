# lrxrn.dev

Personal portfolio of Meesum (lrxrn). One quiet page: name, stack, work, experience, education and contact, over a living ASCII ocean.

- **Stack:** Svelte 5, Vite 6, [asciify-engine](https://asciify.org) 4.33, self-hosted Lexend (`@fontsource-variable/lexend`). No CSS framework.
- **Hosting:** GitHub Pages, deployed from `main` by `.github/workflows/deploy.yml`. `CNAME` holds the custom domain.
- **Site URL:** `https://lrxrn.dev` (canonical, share tags, sitemap and structured data all use it).

## Run it

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/ (index.html and 404.html)
npm run preview    # serve dist/
npm run stats      # refresh commit counts from GitHub (add -- --write to save)
node src/lib/duration.test.js   # self-check for the duration maths
```

## Edit the content (no code needed)

Everything on the page comes from JSON in `src/data/`.

| File | What it drives | Fields |
| --- | --- | --- |
| `experience.json` | Experience section | `role`, `org`, `type`, `start` (`YYYY-MM`), `end` (`YYYY-MM` or `null` = current, shows a coral "Present" badge). Durations are computed. |
| `education.json` | Education section | `degree`, `school`, `start`, `end` (years), `active: true` shows a coral "Year N" badge. |
| `stack.json` | Stack pills | Groups of `{ name, color }`; `color` is the brand hex used for the pill. |
| `projects.json` | Work section | `name`, `line`, `commits`, `share`, `contributors`, `languages` (top 3, `{ name, pct }`), `repo`, `langRepo`, `url`, `featured`, `hidden`. |

Project rules:

- **Rotation:** 3 random projects with `featured: true` show on every load; everything else sits under "All N projects".
- **Links:** set `url` only for things visitors can open. No `url` means a plain row.
- **Commit counts:** shown rounded down with a `+` (854 shows as `850+`). `npm run stats` refreshes `commits`, `share`, `contributors` and the top 3 `languages` for entries that have a `repo` (or a `langRepo` for languages only) (needs `gh` signed in).
- **Hidden:** `hidden: true` removes a project everywhere.

## How it is built

```
index.html, 404.html      entries (meta, JSON-LD, noscript fallback) ; 404 and privacy/index.html are extra Vite inputs
src/main.js               mounts App.svelte
src/App.svelte            skip link, ocean, WAIU pill, then the sections
src/sections/             Hero, Stack, Work, Experience, Education, Contact, Footer
src/components/           AsciiBackground (ocean), NameSwap, Nudge, SectionTitle, Shark, WAIU
src/stores/               theme (data-theme on <html>), sea (live ocean handle)
src/lib/                  asciify.js (lazy loader), duration.js (+ test)
src/styles/global.css     palette tokens, base, shared row/badge classes, glass, print
src/notfound.js           404 page (asciify notFound field)
scripts/update-commits.mjs  npm run stats
public/                   favicons, og.png, robots.txt, sitemap.xml, llms.txt
privacy/index.html        privacy page (static; keep in sync with any analytics or third party)
prototype/                design prototypes (not part of the build)
```

### Design

- **Palette:** paper and ink, violet (primary), coral (current/active), plus iris (shark) and teal (manta). Flat colours only. Tokens live in `global.css`, light and dark, and follow `data-theme` (set by `src/stores/theme.js`, falling back to the system setting).
- **Glass:** `main::before` frosts the whole page over the ocean so text stays readable (no card, no shadow).
- **Peek:** the `≈` button next to the name (Esc to return) lifts the glass and fades the page so you can play with the sea. It toggles `html.peek`.
- **Motion:** 120 to 240ms transitions, ease-out, `prefers-reduced-motion` honoured everywhere.

### asciify

All asciify calls go through `src/lib/asciify.js` (a lazy `import()` after first paint) and are wrapped so the page still works if WebGL2 is missing.

| Where | Component |
| --- | --- |
| Background | `ocean`: one shark (iris), one manta (teal), one jellyfish (coral), two schools. Receives the pointer through empty space. |
| Section titles | `decode` on scroll |
| Email button | `beam` |
| Contact | (the email button uses `beam`; no orb) |
| Theme toggle | native View Transitions crossfade (asciify `pageDissolve` was too heavy on phones) |
| 404 | `fieldBackground` `notFound` |

### Name swap

`lrxrn.` swaps to `Meesum.` on hover, focus or tap, through an ASCII-character scramble. The box is fixed-width (a hidden sizer holds the longer name) so the pointer can never leave it mid-swap, and a 120ms leave delay stops edge flicker.

### What I'm up to (WAIU)

The pill at the top connects to `wss://waiu.lrxrn.workers.dev/ws` and shows the current activity or schedule. It hides itself when there is nothing live.

## Deploy

Push to `main`. The workflow runs `npm ci` and `npm run build` and publishes `dist/`. `404.html` is served by GitHub Pages for unknown paths. The `CNAME` file must match the domain you want served.
