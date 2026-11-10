# MMAI Lab Website — Requirements Brief

> **Name change (2026-11):** the lab is now the **m²AI BMD Lab — Multimodal AI Biomedical Data Analysis Laboratory** (URL-safe `m2ai-lab`). Read "MMAI Lab" below as the old name.

Oct 2, 2026 · @Florenc

## 1. Purpose and scope

Build a content-driven website for the **MMAI Lab — Multimodal AI Lab** at the University of Stavanger (UiS), replacing the current hand-written static site. The site presents the lab as a synchronized multimodal sensing environment, with an interactive digital twin of the lab as its visual identity and main navigation.

Tagline: **Sensing. Understanding. Improving Lives.**

**Goals**

- Make the lab understandable in under a minute: what it is, what it can measure, and why the modalities belong together.
- Let researchers, students and companies find the right equipment and the right contact person quickly.
- Make adding a device, researcher, application, project or publication a matter of editing one structured file and pushing to git — no HTML editing.
- Always show an accurate picture of what is installed, being acquired, or planned.

**Audiences**

- Researchers and PhD students (UiS and external) planning experiments.
- Clinical and healthcare partners.
- Companies developing sensing, wearable, biomedical and AI technologies.
- Funders, reviewers and the general public.

**What changed from the original brief**

- Added a structured content model and editing workflow, so the site "grows with the lab" in practice.
- Specified the digital-twin implementation with a lightweight fallback, so the site works on low-end phones, without WebGL and for keyboard and screen-reader users.
- Added accessibility requirements. UiS is a public institution, so Norwegian universal-design rules (WCAG 2.1 AA) apply.
- Added privacy, performance, bilingual (English/Norwegian) and SEO requirements.
- Added a phased delivery plan, so a strong first version can go live before the full 3D model exists.
- Made the equipment status (installed / being acquired / planned) a required field on every device, shown everywhere the device appears.
- Kept the OmniBuds site (omnibuds.tech) as a reference for philosophy and pacing only — no copying of its layout, assets or text.

## 2. Design direction

The site should feel like entering the lab, not reading a university infrastructure page. No text-heavy pages, deep menus or static equipment tables on the main experience.

**Principles**

- Full-width visual sections, each with one idea and very little visible text.
- Large, confident typography; short statements; generous whitespace.
- Information revealed progressively through scrolling and interaction.
- Smooth, restrained motion (fades, reveals, camera moves in the digital twin). All motion respects `prefers-reduced-motion`.
- The interactive digital twin is the signature element and reappears across sections (hero, Explore the Lab, Explore by Application).
- Light and dark themes; UiS brand colours respected where required, with a distinct MMAI accent colour for highlights and device glow.
- A minimal top bar: logo, 4–5 anchor links, language switch, "Collaborate" button.

**Visitor journey**

1. Discover the Lab — hero rendering and tagline.
2. Explore the Space — interactive digital twin.
3. Explore the Sensors — modality tiles.
4. Understand Multimodal AI — Move → Sense → Fuse → Understand.
5. Explore Applications — select an application, see the relevant systems light up.
6. Meet the Researchers — people, expertise, contact.
7. Collaborate With Us — call to action for companies and partners.

Every step must also work as a plain, readable page section without JavaScript or 3D, so nothing important is locked inside the interactive scene.

## 3. Page sections (home page)

### 3.1 Hero — Discover the Lab

- A large, high-quality 3D/isometric rendering of the actual MMAI Lab fills most of the first screen.
- Minimal text: **MMAI Lab** / **Multimodal AI Lab** / Sensing. Understanding. Improving Lives.
- No device labels on the rendering. A subtle scroll cue only.
- The hero image must load fast: a pre-rendered, optimised image (AVIF/WebP) is shown first; the interactive scene loads after it.

### 3.2 Explore the Lab — interactive digital twin

- Heading: **Explore the Lab**. As the visitor scrolls, the rendering becomes interactive (optionally a gentle camera move into the room).
- Hover (desktop) or tap (touch) on a device: that device glows or gets an outline; the rest of the scene stays unchanged.
- A floating card shows: device name, status badge, one-line description, applications, responsible researcher(s) with an email icon (`mailto:`), and "More details →" linking to the device page.
- Keyboard: Tab moves through devices in a logical order; Enter opens the card; Esc closes it. Each device has an accessible name.
- Toggle "Show all devices" reveals labels for visitors who prefer them; off by default.
- The OptiTrack capture volume (about 5 × 8 m, 12 ceiling cameras) can be shown as a translucent floor area, with optional virtual sub-zones for smaller studies.
- Planned and being-acquired devices are shown visually distinct (for example ghosted or dashed outline), or hidden by a filter.
- Below the scene: a compact text list of all devices with the same information, for accessibility, SEO and no-JS visitors.

### 3.3 One Lab. Multiple Modalities.

Subtitle: From movement to physiology, environment and context. Seven large tiles, each opening to its device list:

- **Motion & biomechanics** — OptiTrack, full-body IMU networks, EMG + IMU body sensor networks, force platforms, pressure and smart-insole systems.
- **Physiological & neural sensing** — research-grade EEG, EMG, ECG, PPG and cardiovascular sensing, respiration, multimodal smartwatches and wearables.
- **Vision & contactless sensing** — RGB/optical, thermal, depth/3D, radar/contactless, eye tracking and wearable eye-tracking glasses.
- **Audio & behavioural sensing** — microphone arrays, wearable audio, speech/audio analysis, human–environment interaction sensing.
- **Localization & connectivity** — UWB real-time localization, Bluetooth/BLE wearable networks, IoT/IoMT, 5G–6G experimentation where applicable.
- **Medical & clinical sensing** — portable ultrasound, portable/low-field imaging where available, clinical and research-grade biomedical acquisition.
- **AI & computing** — Edge-AI platforms and embedded nodes, GPU workstation, synchronized multimodal acquisition, research storage/NAS, real-time processing and sensor fusion.

Each tile shows counts by status (e.g. "5 installed · 2 being acquired · 1 planned"). Tiles and lists are generated from the content files, never hand-written.

### 3.4 From signals to Multimodal AI

- A large animated visual: **MOVE → SENSE → FUSE → UNDERSTAND**. Signal streams from motion capture, IMUs, EMG, EEG, ECG, cameras, pressure, audio and localization converge into one AI representation.
- Text: **Humans are inherently multimodal. Our research infrastructure should be too.** followed by the paragraph from the original brief.
- Add one short line on synchronization (common clock / hardware sync), since synchronized acquisition is the lab's key technical differentiator.

### 3.5 Explore by application

- Selectable chips: Gait & Mobility · Parkinson's Disease · Human Activity Recognition · Fall Detection · Rehabilitation · Balance · Upper-body Movement · Aging & AAL · Sports & Performance · Digital Biomarkers · Wearable AI · Edge AI.
- Selecting one highlights the linked devices in the digital twin and lists them (e.g. Gait & Mobility → OptiTrack + IMUs + EMG + force/pressure + smart insoles; HAR → OptiTrack + wearable IMUs + smartwatch + localization + Edge AI).
- Also shows a one-sentence description, the researchers involved, and linked projects/publications when they exist.
- Selection is reflected in the URL (e.g. `#app=gait`) so a view can be shared.

### 3.6 Meet the researchers

- Grid of researchers: photo, name, role, expertise tags, email icon, link to UiS profile.
- Each researcher page lists their devices, applications, projects and publications.

### 3.7 Collaborate with us

- Heading: **Bring your technology into the MMAI Lab**, the paragraph from the original brief, and a **Collaborate with us →** button (`mailto:` to a shared lab address, or a contact page).
- Short list of collaboration types: integration, validation, demonstration, joint projects, student projects.

### 3.8 Footer

UiS logo and link, address and visiting info, shared lab email, accessibility statement (tilgjengelighetserklæring) link, privacy note, language switch.

### 3.9 Other pages

Generated detail pages for each device, researcher, application, project and publication; a searchable/filterable equipment catalogue (the one place a table view is fine); News (optional); About/Contact/Visiting.

## 4. Content model

All content lives as one file per item (YAML or Markdown with front matter) in the repository, validated against a schema at build time. Relations are stored by ID on one side only; the reverse links (e.g. "devices this researcher is responsible for") are computed at build time.

Relations: a device has one or more researchers and belongs to one or more modalities and applications; projects link devices, researchers and applications; publications link projects, devices and researchers.

| Collection | Key fields | Links to |
|---|---|---|
| `devices` | id, name (en/no), short description, long description, status, modality, manufacturer/model, key specs, quantity, image, 3D object ID, acquisition date, sync capability, booking notes | researchers, applications |
| `modalities` | id, name (en/no), subtitle, icon, order | — |
| `applications` | id, name (en/no), one-line description, image, order | devices, researchers |
| `researchers` | id, name, role, photo, expertise tags, email, UiS profile URL, ORCID, active (yes/no) | — |
| `projects` | id, title, acronym, funder, period, description, URL | devices, researchers, applications |
| `publications` | id, title, authors, venue, year, DOI, dataset URL | projects, devices, researchers |
| `zones` | id, name, floor rectangle (m), description | devices |
| `settings` | lab email, address, OptiTrack area, social links | — |

**Status (required on every device)**

- `installed` — available for experiments now.
- `acquiring` — ordered or being installed; expected date shown if known.
- `planned` — future infrastructure; never presented as available.
- `retired` — kept for publication history, hidden from the lab views.

The status is shown as a badge on cards, tiles, the twin and detail pages. A build check fails if a device has no status or no responsible researcher.

**Example device file**

```markdown
---
id: optitrack
name: { en: "12-Camera OptiTrack Motion Capture System", no: "OptiTrack bevegelsesfangst med 12 kamera" }
status: installed
modality: motion-biomechanics
summary: { en: "High-precision 3D human motion capture across a 5 × 8 m experimental area." }
specs: { cameras: 12, mounting: ceiling, area_m: [5, 8] }
researchers: [florenc-demrozi]
applications: [gait, balance, rehabilitation, har, biomechanics, fine-movement]
twin_object: optitrack_cameras
sync: hardware
image: ./optitrack.jpg
---
Longer description in Markdown.
```

The `twin_object` field is the only link between content and the 3D scene: it names the object (or group) in the 3D model. Adding a device to the twin means adding it to the model with that name; everything else comes from the content file.

## 5. Technical architecture

A static site generated from the content files, with the digital twin as a progressively loaded interactive component. No server, no database at runtime: the "database" is the content folder in git.

**Recommended stack** (the developer may propose alternatives with reasons)

- **Astro** as the static site generator: typed content collections with schema validation, near-zero JavaScript by default, interactive "islands" only where needed.
- **TypeScript** throughout; **Zod** schemas for every collection.
- **Three.js** (optionally via a thin wrapper) for the digital twin, loaded only when the Explore section approaches the viewport.
- **glTF/GLB** model with Draco or Meshopt compression and compressed textures (KTX2); target under 5 MB for the default model.
- Plain CSS with custom properties (or Tailwind if preferred) for theming and light/dark mode.
- Scroll-driven motion via CSS scroll-driven animations or a small library; no heavy animation framework unless justified.
- **Pagefind** (or similar) for static search across devices, researchers and publications.

**Digital twin — two layers, built in this order**

1. **2D hotspot layer (Phase 1):** a high-quality pre-rendered isometric image of the lab, with an SVG overlay of one shape per device. Hover/tap/keyboard behave exactly as described in 3.2. Works everywhere, loads instantly, and is the permanent fallback.
2. **3D layer (Phase 2):** the same scene as a real-time model with picking (raycasting), outline/glow, camera transitions and application highlighting. Used only when WebGL is available, the device is capable, and reduced motion is not requested; otherwise the 2D layer stays.

Both layers read the same device data and use the same card component, so content is written once.

**3D model source**

Model the room in Blender from real measurements (floor plan, ceiling height, camera positions), using a photogrammetry or LiDAR scan as reference if available. Each device is a separate named object matching `twin_object`. The pre-rendered hero image and the 2D hotspot image are rendered from the same model and camera, so all three views match.

**Suggested repository structure**

```
mmai-lab-website/
├─ src/
│  ├─ content/
│  │  ├─ devices/        # one .md per device
│  │  ├─ modalities/
│  │  ├─ applications/
│  │  ├─ researchers/
│  │  ├─ projects/
│  │  ├─ publications/
│  │  └─ zones/
│  ├─ content.config.ts  # Zod schemas + relation checks
│  ├─ components/        # Hero, DeviceCard, ModalityTile, PipelineVisual…
│  ├─ twin/              # 2D hotspot layer + 3D viewer
│  ├─ layouts/
│  ├─ i18n/              # UI strings en/no
│  └─ pages/             # [lang]/devices/[id], researchers/[id], …
├─ public/
│  ├─ models/lab.glb
│  └─ images/
├─ scripts/              # content validation, image optimisation
├─ .github/workflows/    # build, check, deploy
├─ README.md             # how to add content
└─ CLAUDE.md             # conventions for Claude Code
```

## 6. Non-functional requirements

**Accessibility (mandatory)**

- WCAG 2.1 AA, as required for Norwegian public-sector websites under the universal-design regulations (to be confirmed with UiS web/communications).
- Full keyboard and screen-reader access to the digital twin and application selector; visible focus states.
- Every interactive visual has an equivalent text list on the same page.
- Colour contrast checked in both themes; status never conveyed by colour alone (badge text too).
- `prefers-reduced-motion` disables scroll animations and camera moves.
- An accessibility statement page.

**Performance**

- Lighthouse score of at least 90 for performance and accessibility on mobile.
- Largest Contentful Paint under 2.5 s on a mid-range phone over 4G; the 3D model never blocks first render.
- Responsive images in AVIF/WebP with explicit sizes; fonts self-hosted and subset.

**Privacy and security**

- No third-party trackers, cookie banners or external fonts/CDNs by default (GDPR-friendly). If analytics are wanted, use a cookieless, self-hostable option and document it.
- Email addresses rendered with light obfuscation to reduce scraping, while `mailto:` still works with one click.
- Researcher photos and data published only with the person's consent.

**Languages**

- English as primary, Norwegian (bokmål) as secondary. Each content field can carry `en` and `no`; missing translations fall back to English.

**SEO and sharing**

- Each device, researcher, application, project and publication has its own URL, title, description and Open Graph image.
- Structured data (schema.org) for the organisation, people and publications; a sitemap.

**Browser and device support**

- Current versions of Chrome, Edge, Firefox and Safari (desktop and mobile). Touch, mouse and keyboard all first-class.

## 7. Deployment, editing and migration

**Deployment**

- Source in a git repository (GitHub, or UiS GitLab if preferred by IT).
- CI on every push and pull request: install, schema/relation validation, link check, accessibility check (axe), build.
- `main` branch deploys automatically to production (GitHub Pages, GitLab Pages, or a UiS-hosted static server). Pull requests get a preview build where the host supports it.
- Custom domain (e.g. a uis.no subdomain) with HTTPS; agree DNS with UiS IT.

**Editing workflow**

- Default: edit or add a Markdown/YAML file, commit, push (or open a pull request). The README gives copy-paste templates for each content type.
- Optional (Phase 3): a git-based CMS (e.g. Decap CMS or similar) so non-technical staff can edit through a web form; it writes the same files to git.
- Adding a new device = one content file + one image + (for the twin) one named object in the 3D model and one hotspot shape. Until the model is updated, the device still appears everywhere except the twin, flagged in the build log.

**Migration from the existing static site**

- Inventory the current pages, text, images and URLs.
- Move reusable content into the new content collections; keep useful images.
- Add redirects from old URLs to the new ones so existing links keep working.
- Keep the old site in a tagged branch or archive folder until the new one is live.

## 8. Delivery plan, acceptance and open questions

**Phases**

1. **Foundation** — repo, Astro setup, schemas, CI/deploy, design tokens, migrate existing content, seed devices/researchers/applications. Generated device and researcher pages.
2. **Home experience (2D)** — hero, modality tiles, Move → Sense → Fuse → Understand visual, application selector, researchers, collaborate section; digital twin as 2D hotspot layer using a pre-rendered image. Go live.
3. **3D digital twin** — Blender model, GLB export, real-time viewer with picking, glow, camera moves and application highlighting; 2D layer kept as fallback.
4. **Growth** — projects, publications, datasets, news, optional CMS, Norwegian translations completed.

**Acceptance criteria**

- ☐ Adding a new device file (with status and researcher) makes it appear on the home tiles, catalogue, application views and its own page with no code changes.
- ☐ A device with missing status or researcher fails the build with a clear message.
- ☐ Hover, tap and keyboard all open the same device card; the email icon opens the mail client.
- ☐ Selecting an application highlights exactly the devices linked to it, in both 2D and 3D layers.
- ☐ Planned and being-acquired equipment is never shown as available.
- ☐ Site passes automated axe checks and a manual keyboard/screen-reader pass.
- ☐ Lighthouse mobile performance and accessibility ≥ 90.
- ☐ Site works with JavaScript disabled (all content readable, no twin interaction).
- ☐ Push to `main` deploys automatically.

**Open questions**

- Hosting and domain: GitHub Pages, UiS GitLab Pages or a UiS server? Which domain?
- UiS visual-profile rules: required logo, colours and fonts?
- Who will build the 3D model, and do we have a floor plan, measurements or a scan of the room?
- Final device list with status, responsible researchers and photos.
- Shared lab email address for the Collaborate button.
- Is Norwegian needed at launch or in Phase 4?
- Is equipment booking in scope later (calendar or request form)?

**Instructions for Claude Code**

Place this brief in the repository as `docs/REQUIREMENTS.md` and summarise its conventions in `CLAUDE.md`. Then ask Claude Code to work phase by phase:

1. Inspect the existing static site and list content to migrate.
2. Propose the stack and file structure from section 5 and wait for approval.
3. Build Phase 1, with schemas and build checks first, then pages.
4. Build Phase 2 section by section, checking each in the browser (desktop and mobile widths, light and dark, keyboard only) before moving on.
5. Keep all lab-specific text and data in `src/content/`, never hard-coded in components.
6. Use placeholder images and clearly marked dummy data where real content is missing, and list them in a `TODO-content.md` file.
