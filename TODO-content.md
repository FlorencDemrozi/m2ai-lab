# Content still needed

Real content that is missing. Until it arrives the site uses clearly marked placeholders:
files with `placeholder: true` show an **Unconfirmed** badge, and the build log counts them.
Tick items off as they arrive, and remove `placeholder: true` from the files you confirm.

## Decided

- [x] Motion capture is **OptiTrack** (12 ceiling cameras, ~5 × 8 m). The old site's "Qualisys" is dropped.

## Devices — `src/content/devices/`

- [x] The 34 items in the equipment inventory (Nov 2026) are in, as `status: installed` with their
      `source` (Lab / PI collection / Shared at UiS / Via collaboration) and official product links.
- [ ] **Responsible researcher** for every inventory item: all default to Florenc Demrozi (marked `# TODO`).
- [ ] **Linked applications** for every inventory item were guessed by Claude (marked `# TODO`).
- [ ] **Collaboration items** (Visual3D, Enobio 8, Polar H10, Tobii Pro Glasses 2, Meta Quest 2): the inventory
      quantities are placeholders, so no quantity is shown. Add `quantity` once confirmed.
- [ ] Sync capability (`sync`) is set only for OptiTrack and Delsys (hardware). Confirm the others (TTL / LSL).
- [ ] Sample-rate labels in the home-page signal monitor (`src/content/categories/*.yaml`, `signal.rate`): only
      OptiTrack (up to 360 Hz), Delsys (≈ 2 kHz), Neon (200 Hz) and the B310 (≤ 7.2 GHz) are shown. Confirm or add.
- [ ] Replaced by real inventory items and deleted: wireless EMG, smartwatches, eye-tracking glasses, thermal/optical
      cameras, GPU workstation, edge-AI nodes, mobile EEG, ECG wearables.
- [ ] **13 wish-list devices remain `planned` + `placeholder: true`** (force platforms, smart insoles, Xsens, markerless
      depth cameras, open-source EEG, screen eye tracker, microphone array, wearable microphones, UWB, ISAC testbed,
      low-field MRI, POCUS, research storage). Keep, confirm or delete each; researchers and applications are guesses.
- [ ] Device photos (our own; no manufacturer images). Until then cards use icons.

## Text

- [ ] Home-page copy in `src/content/home.yaml` (hero intro, "what makes the lab different", pipeline steps) was
      drafted by Claude from the inventory notes. Review it.

- [ ] §3.4 paragraph "from the original brief" (after "Humans are inherently multimodal…"). The original brief is not in the repo.
- [ ] §3.7 paragraph "from the original brief" (Collaborate section).
- [ ] One-sentence descriptions for the 12 applications (`src/content/applications/*.yaml`; Claude drafted them as placeholders).
- [ ] Review the About page (`src/content/pages/en/about.md`), carried over and lightly edited from the old site.
- [ ] Official accessibility statement (`src/content/pages/en/accessibility.md` is a draft; it should link to uustatus.no).
- [ ] Norwegian: category and application names, the full lab name ("Laboratorium for multimodal KI og biomedisinsk dataanalyse"), UI strings (`src/i18n/ui.ts`) and the tagline "Måle. Forstå. Forbedre liv." were drafted by Claude and **need review by a native speaker**. No Norwegian versions of pages or device texts yet.

## People — `src/content/researchers/`

- [ ] For the 11 researchers carried over from the old site: role, email, UiS profile URL, ORCID, and **consent** to publish their photo and details (`consent: true`).
      Only Florenc Demrozi has an email so far.
- [ ] Researcher photos.
- [ ] Is the list still complete? Should anyone be added or set to `active: false`?

## Images and 3D

- [ ] Hero render and 2D isometric twin image (both from the same Blender model and camera).
- [ ] Floor plan, ceiling height, camera positions or a scan of room KE E-470. The OptiTrack zone's position in the room (`src/content/zones/capture-volume.yaml`) is a placeholder.
- [ ] Device photos.
- [ ] UiS logo files and visual-profile rules. The colours and fonts in `src/styles/tokens.css` are provisional.
- [ ] Open Graph images: `public/og-default.png` is a generated placeholder shared by every page.

## Settings — `src/content/settings.yaml`

- [ ] Shared lab email address (currently florenc.demrozi@uis.no).
- [ ] Building name and postal address (currently "Kjølv Egelands hus, Kristine Bonnevies vei 22, 4021 Stavanger"; please confirm).
- [ ] Visiting information.
- [ ] Social links, if any.

## Open questions (REQUIREMENTS §8)

- [ ] Hosting and domain: the name is now `m2ai-lab`. Rename the GitHub repository (currently `mai-lab`) to
      `m2ai-lab` so GitHub Pages serves it at `/m2ai-lab/`; a custom domain (e.g. a uis.no subdomain) still needs UiS IT.
- [ ] Is Norwegian needed at launch?
- [ ] Is equipment booking in scope later?
