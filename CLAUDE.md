# m²AI BMD Lab website — conventions for Claude Code

Website for the **m²AI BMD Lab — Multimodal AI Biomedical Data Analysis Laboratory**, University of Stavanger
(formerly "BMD Living Lab", then briefly "MMAI Lab"). Write the name with a real "²"; the URL-safe
form for repository, package and domain is **`m2ai-lab`** (never `mmai-lab`).
Tagline: **Sensing. Understanding. Improving Lives.** (full stops, not commas).

Full spec: `docs/REQUIREMENTS.md` (converted from `docs/MMAI Lab Website — Requirements Brief.docx`; the .docx is the source of truth if they differ,
except for the lab name, which changed after the brief).
Missing real content is tracked in `TODO-content.md`.

## Repository layout

- `webpage/` — the **old** hand-written static site (archive only; do not edit, do not build on it). Also git tag `old-site`.
- `docs/` — requirements brief.
- New site: Astro 7 project at the repo root. README.md has the layout and content templates.
  - `src/content.config.ts` — Zod schemas (import `z` from `astro/zod`; Zod 4 API).
  - `src/lib/lab.ts` — `loadLab()`: loads all collections once, checks cross-file ids, computes reverse links. Pages get data from here, not from `getCollection` directly.
  - `src/pages/[...locale]/` — every route once per locale (`locale` param undefined = English at `/`, `no` = `/no/`). Build links with `href(locale, ...segments)` from `src/i18n/ui.ts` (handles base path + trailing slash).
  - `DeviceCard.astro` is THE device card — reuse it in the twin layers.

## Commands

`npm run dev` · `npm run build` (also validates content) · `npm run check` · `npm test` (contrast + links + axe; needs `npx playwright install chromium`) · `npm run test:lighthouse`.
On Windows Git Bash, prefix env vars containing paths with `MSYS_NO_PATHCONV=1` (e.g. `BASE_PATH=/x/`).

## Working mode

- Work **phase by phase** (REQUIREMENTS §8). Phase numbering follows §8:
  1 Foundation · 2 Home experience with 2D hotspot twin (go live) · 3 3D twin · 4 Growth.
  (§5 calls the 2D layer "Phase 1" and 3D "Phase 2" — that refers to the twin's layers, not delivery phases.)
- Propose before building; wait for approval on stack/structure changes.
- Phase 2: build section by section and check each in the browser at desktop and mobile widths, light and dark, keyboard only.
- Do not commit or push unless asked.

## Content rules

- **All lab-specific text and data lives in `src/content/`** — never hard-coded in components.
  UI chrome strings go in `src/i18n/`.
- One file per item (Markdown + front matter or YAML), Zod-validated in `src/content.config.ts`.
- Relations stored by ID on **one side only**; reverse links computed at build time.
- Every device **must** have `status` (`installed` | `acquiring` | `planned` | `retired`) and ≥1 researcher, or the build fails with a clear message.
- Status is shown as a **text badge** (never colour alone) everywhere a device appears.
  `planned`/`acquiring` are never presented as available; `retired` is hidden from lab views.
- `twin_object` is the only link between content and the 3D/2D scene. A device without a twin shape still appears everywhere else and is flagged in the build log.
- Bilingual fields `{ en, no }` (or a plain string = English); missing `no` falls back to `en`.
- Devices carry `categories: [...]` (array, ≥1, ids from `src/content/categories/`) — these replaced the brief's
  "modalities" and follow the lab's equipment inventory. The first category is where the item is listed.
- Devices carry `source` (`lab` | `personal` | `shared-uis` | `collaboration`), shown as a second text badge.
  `status: installed` is labelled "Available" in the UI.
- Official product links go in `url` ("More info"). Never hotlink or copy manufacturer images; use icons or our own photos.
- Applications store no relations; their devices/researchers are derived from device files.
- Placeholder images and dummy data must be clearly marked (`placeholder: true` / `TODO` in the file) and listed in `TODO-content.md`.
- Motion capture is **OptiTrack** (12 ceiling cameras, ~5 × 8 m volume). The old site's "Qualisys" is wrong.

## Technical rules

- Astro + TypeScript + Zod; plain CSS with custom properties (light/dark tokens).
- Near-zero JS by default; interactive islands only for the twin, application selector, equipment filter, theme/menu.
- **Everything must work without JavaScript** (all content readable; twin interaction is the only loss).
- Three.js only in Phase 3, lazy-loaded near the viewport; only when WebGL is available, the device is capable and reduced motion is off. 2D layer is the permanent fallback. Both layers share device data and the same card component.
- No third-party trackers, CDNs or external fonts — self-host and subset fonts.
- All motion respects `prefers-reduced-motion`.
- Emails lightly obfuscated, still one-click `mailto:`.
- Images AVIF/WebP with explicit sizes; hero LCP < 2.5 s on mid-range 4G.

## Quality bar

- WCAG 2.1 AA (Norwegian universal-design rules). Twin: Tab through devices in logical order, Enter opens card, Esc closes, accessible name per device; visible focus.
- Every interactive visual has an equivalent text list on the same page.
- Lighthouse mobile ≥ 90 (performance and accessibility); axe passes in CI.
- Every device/researcher/application/project/publication: own URL, title, description, OG image; schema.org data; sitemap.
- Acceptance checklist: REQUIREMENTS §8.
