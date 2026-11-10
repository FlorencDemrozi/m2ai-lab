# m²AI BMD Lab website

Website for the **m²AI BMD Lab — Multimodal AI Biomedical Data Analysis Laboratory** at the University of Stavanger
(URL-safe name / repository / domain: `m2ai-lab`).
*Sensing. Understanding. Improving Lives.*

A static site built with [Astro](https://astro.build). All lab content lives as one file
per item in `src/content/`. To add a device, researcher or application you edit or add a
file and push — no HTML. The build checks every file and fails with a clear message if
something is missing or links to an id that doesn't exist.

Specification: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) · Missing content: [`TODO-content.md`](TODO-content.md)

## Run it locally

Needs Node 22.12 or later.

```sh
npm install
npm run dev        # http://localhost:4321, reloads as you edit
npm run build      # builds to dist/ and validates all content
npm run preview    # serves dist/
```

Checks (all run in CI on every push and pull request):

```sh
npm run check            # TypeScript / Astro diagnostics
npm run test:contrast    # WCAG AA contrast of the colour tokens, both themes
npm run test:links       # every internal link in dist/ resolves
npm run test:a11y        # axe on every page, light + dark (first: npx playwright install chromium)
npm run test:lighthouse  # mobile Lighthouse, performance + accessibility ≥ 90
```

## Adding content

Each file name is the item's **id** (`src/content/devices/optitrack.md` → id `optitrack`).
Ids are lowercase with hyphens; they appear in URLs, so don't rename them casually.

Text fields can be plain English (`summary: "…"`) or bilingual
(`summary: { en: "…", no: "…" }`). Missing Norwegian falls back to English.

Links between items are stored **on one side only**. Devices list their researchers and
applications; the site works out the reverse (a researcher's devices, an application's
researchers) automatically.

### A device — `src/content/devices/<id>.md`

```markdown
---
name: { en: "Wireless EMG system", no: "Trådløst EMG-system" }
summary: { en: "Muscle activity synchronized with motion capture." }
status: installed            # required: installed | acquiring | planned | retired
expected: "2027-01"          # optional, shown for `acquiring`
source: lab                  # lab | personal | shared-uis | collaboration (default lab)
partner: { en: "Cognitive and Sports Lab, UiS" }   # for shared-uis / collaboration
categories: [emg]            # required, ≥ 1; the first one is where it is listed
researchers: [morteza-esmaeili]                           # required, ≥ 1
applications: [gait, rehabilitation]
manufacturer: "Delsys"
model: "Trigno"
quantity: 16
quantity_note: { en: "Various" }   # instead of a number
url: https://delsys.com/     # official product page → "More info" button
icon: muscle                 # optional, defaults to the category icon
accessory: true              # optional: straps, cables, power → compact card
specs: { channels: 16, "sample rate": "2 kHz" }
sync: hardware               # hardware | software | none | unknown
acquired: 2026-11-15
booking_notes: { en: "Book two days ahead." }
image: ./images/wireless-emg.jpg   # relative to this file; optional
image_alt: { en: "EMG sensors on a forearm" }
twin_object: wireless_emg    # name of the object in the 3D model / 2D hotspot
order: 50                    # position in lists, lower first
---
Longer description in Markdown (optional).
```

- `planned` is never shown as available. `retired` is hidden from the lab views but
  keeps its own page, for publication history.
- Until a device has a shape in the digital twin it still appears everywhere else, and
  the build log lists it.

### A researcher — `src/content/researchers/<id>.md`

```markdown
---
name: "Jane Doe"
role: { en: "Associate Professor", no: "Førsteamanuensis" }
expertise: ["Wearable sensing", "Gait analysis"]
email: jane.doe@uis.no
profile_url: https://www.uis.no/nb/profile/...
orcid: 0000-0002-1825-0097
photo: ./photos/jane-doe.jpg   # only shown when consent: true
consent: true                  # the person agreed to publish photo and details
active: true                   # false hides them from the researcher list
order: 20
---
Optional short bio in Markdown.
```

### An application — `src/content/applications/<id>.yaml`

```yaml
name: { en: "Fall Detection", no: "Fallgjenkjenning" }
description: { en: "Detecting and predicting falls with wearable and contactless sensors." }
order: 4
```

### A project — `src/content/projects/<id>.md`

```markdown
---
title: { en: "Full project title" }
acronym: "ACRONYM"
funder: "Research Council of Norway"
start: 2026-01-01
end: 2029-12-31
url: https://example.org
devices: [optitrack, xsens-awinda]
researchers: [florenc-demrozi]
applications: [gait]
---
Project description.
```

### A publication — `src/content/publications/<id>.yaml`

```yaml
title: "Paper title"
authors: ["A. Author", "B. Author"]
venue: "IEEE Sensors Journal"
year: 2027
doi: 10.1109/JSEN.2027.0000000
dataset_url: https://zenodo.org/records/0000000
projects: [acronym]
devices: [optitrack]
researchers: [florenc-demrozi]
```

### Other content

| File | What it holds |
|---|---|
| `src/content/categories/<id>.yaml` | Equipment categories (filter tags, home tiles, signal lanes): name, short, subtitle, icon, featured, signal, order |
| `src/content/home.yaml` | Home-page copy: hero intro, highlights, pipeline steps, collaborate text |
| `src/content/zones/<id>.yaml` | Floor areas (e.g. the OptiTrack volume) in metres, with their devices |
| `src/content/settings.yaml` | Lab name, tagline, shared email, address, social links |
| `src/content/pages/<en\|no>/<page>.md` | Free-text pages (About, Accessibility). A missing `no` file falls back to `en` |
| `src/i18n/ui.ts` | Interface strings (buttons, labels) in English and Norwegian |

### Placeholders

Anything not yet confirmed has `placeholder: true`. The site shows it with an
"Unconfirmed" badge, and it is listed in `TODO-content.md`. When you confirm the facts in
a file, remove the line.

## Project layout

```
src/
  content/            all lab content (see above)
  content.config.ts   schemas: required fields, types, clear error messages
  lib/lab.ts          loads content once, checks links between files, computes reverse links
  components/         DeviceCard, StatusBadge, ResearcherCard, Email, Header, Footer…
  layouts/Base.astro  page shell: SEO tags, hreflang, theme, skip link
  pages/[...locale]/  every route, once for English (/) and once for Norwegian (/no/)
  styles/             design tokens (light/dark) and global styles
  i18n/ui.ts          interface strings and URL helpers
scripts/              a11y (axe), contrast checks
webpage/              the old BMD Living Lab site (archive; also tagged `old-site` in git)
```

## Deployment

`.github/workflows/deploy.yml` builds `main` and publishes it to GitHub Pages. The
workflow sets `SITE_URL` and `BASE_PATH`, so the site works on a project sub-path or a
custom domain. Hosting and domain are still to be agreed with UiS IT; if the site moves
elsewhere, only the deploy job changes.
