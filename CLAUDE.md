# CLAUDE.md

Personal portfolio (Svelte 5 + Vite 6 + asciify-engine). Read `README.md` for the layout; this file is the rules for changing it.

## Commands

- `npm run dev` / `npm run build` / `npm run preview`
- `node src/lib/duration.test.js` after touching `src/lib/duration.js`
- `npm run build` must stay clean (no Svelte warnings) before finishing
- `npm run stats -- --write` refreshes project commit counts (needs `gh`)

## Rules

- **Content lives in `src/data/*.json`.** Add or change experience, education, stack and projects there, not in components. Experience dates are `YYYY-MM`; `end: null` means current.
- **No CSS framework.** Scoped CSS in components, shared classes (`.row`, `.badge`, `.reveal`) and tokens in `src/styles/global.css`. Use the tokens (`--violet`, `--coral`, `--iris`, `--teal`, `--bg`, `--fg`, `--muted`, `--line`); no new hex values in components except brand colours in `stack.json`.
- **Flat colours only**, no gradients. Violet is primary, coral marks "current". Both themes must work (`data-theme` on `<html>`).
- **Minimal.** The owner likes minimal. Prototype visual changes in `prototype/` and get approval before porting. Do not add sections, effects or dependencies unasked.
- **Motion:** transform and opacity only, under 300ms, ease-out `--ease-out`, honour `prefers-reduced-motion`. Never animate keyboard actions.
- **Mobile first-class:** single column, 44px tap targets, no horizontal scroll (check at 375px).
- **Accessibility:** real text stays in the DOM, visible focus rings, skip link, `aria-hidden` on decorative effects. Lighthouse Accessibility, Best Practices and SEO should stay at 100.

## asciify

- Import only through `src/lib/asciify.js` (`kit()` lazy import). Never import `asciify-engine/kit` at module top level. Always catch failures: the page must work without WebGL2.
- Call `destroy()` in `onMount` cleanup, and guard with a `dead` flag for the async import.
- The ocean host (`AsciiBackground.svelte`) takes the pointer; `main` is `pointer-events: none` and interactive elements opt back in in `global.css`. If you add a new interactive element inside `main`, add it to that `:is(...)` list.
- `pill` is not used any more (its glyph dot nudged chips out of line); the sea chips are plain buttons.
- `decode` cannot re-target text it has already drawn, so the name swap uses its own scramble in `NameSwap.svelte`.
- Docs: https://asciify.org/llms.txt (kit reference at `/skill/references/kit.md`). Tested against 4.33.0; check the installed version's exports before using newer options.

## Name swap (do not regress)

`NameSwap.svelte` keeps a fixed-width box via a hidden `.sizer` so the hover target never shrinks, and delays leave by 120ms. Do not make the heading `width: fit-content` around the animated text.

## SEO and meta

Site URL is `https://lrxrn.dev`. Canonical, OG, JSON-LD, `public/sitemap.xml`, `robots.txt` and `llms.txt` all use it; keep them in sync. `public/og.png` (1200x630) is rendered from `prototype/og.html`. The `CNAME` file controls the served domain and must match.

## Git

- Short, simple commit messages and PR descriptions. No em dashes.
- `dist/` and `node_modules/` are ignored. `prototype/` is design scratch space, not part of the build.
- Two untracked user files in `src/components/AnimatedIcons/` (`sparkles.svelte`, `sword.svelte`) are not used; leave them alone.

## Privacy

`privacy/index.html` is the privacy page (static HTML, styled by `src/privacy.js`). It names Cloudflare Web Analytics (injected automatically by Cloudflare at the edge, EU visitors excluded; there is no snippet in the repo) and states nothing identifying is collected. **If you add analytics, a cookie, a form or any new third party, update that page first** (name the tool, say what it collects) and keep it cookieless so no consent banner is needed.
