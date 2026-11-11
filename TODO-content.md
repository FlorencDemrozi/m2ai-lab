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
- [ ] **11 wish-list devices remain `planned` + `placeholder: true`** (force platforms, smart insoles, Xsens,
      open-source EEG, screen eye tracker, microphone array, UWB, ISAC testbed,
      low-field MRI, POCUS, research storage). Keep, confirm or delete each; researchers and applications are guesses.
- [ ] Device photos (our own; no manufacturer images). Until then cards use icons.
- [x] New items (Nov 2026), all available: multispectral LED illuminator, 20 × WitMotion WT901WIFI (WiFi model),
      100 × BLE coin-size sensors (built in-house), Samsung 98-inch display on the west wall.
- [ ] Still missing for them: illuminator model and wavelengths, which sensors the BLE coins carry, display model.
- [x] Wearable microphones placeholder replaced by the real item: 5 × RØDE Wireless PRO sets.
- [x] Markerless depth cameras removed as a planned item: the PrimeX 22 cameras are dual mode (IR + depth), now in
      the OptiTrack entry.
- [ ] **DWL EX-Dop transcranial Doppler (TCD)** added as `acquiring` + `placeholder: true` (brain-health score).
      Confirm: expected date, responsible researcher (defaults to the PI), applications (guessed), quantity and official
      product link. It, low-field MRI and POCUS appear under "Beyond signals" in the home-page monitor (`home.yaml` → `beyond`).
- [ ] **TI mmWave radar kit** added as `acquiring` (being purchased): 3 × AWR6843ISK radar + 3 × DCA1000EVM capture
      card, on shelf unit 5. Confirm: expected date, responsible researcher (defaults to the PI), applications (guessed);
      set to `installed` when they arrive.
- [x] Control station: lab workstation with two 28-inch monitors (in its specs and in the twin).

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

- [x] 12 researchers (Kjersti Engan added Nov 2026). Role, email, UiS profile link and photo come from each
      person's public UiS profile; the lab confirmed they agreed to be shown (`consent: true`).
- [ ] ORCID for each person.
- [ ] Expertise keywords: carried over from the old site and drafted; Kjersti Engan has none yet. They appear only on
      each researcher's own page.
- [ ] English job titles were translated from the Norwegian UiS titles (e.g. Førsteamanuensis → Associate Professor,
      Førsteamanuensis II → Adjunct Associate Professor). Check them.
- [ ] Is the list complete? Should anyone be set to `active: false`?
- [ ] `docs/Multimodal_AI_Lab_researcher_survey.xlsx` (kept out of git) will be used to fill in precise researcher details.

## Images and 3D

- [ ] Hero render and 2D isometric twin image (both from the same Blender model and camera).
- [x] **2D twin layout** (`src/content/twin.yaml`) now follows `docs/Lab-Map.png` and `docs/UiS_Lab_Interactive_3D.html`.
- [ ] Only **10 of the 12 OptiTrack cameras** have positions on the map; place the other 2.
- [ ] Provisional positions in the twin: thermal tripods, USRP antenna stands and all planned devices (ISAC rack between
      the north doors, low-field MRI in the south of the room). Every device is now in the twin: the east-wall storage is
      drawn as 5 open shelf units, one per group (XR/eye tracking · EMG/IMU/EEG · wearables/IoT · audio/thermal/imaging/edge
      · radar/storage/connectivity). Confirm the cabinets really are open shelves and which unit holds what. Visual3D is drawn as a
      licence dongle on the control-station desk.
- [ ] The 3D model also lists an **OptiTrack eSync 2**, a **PoE switch** and a **charging station**, which are not in the
      inventory. Add them as devices?
- [ ] Logo subtitle says "Multimodal AI Lab"; the site's full name is "Multimodal AI Biomedical Data Analysis
      Laboratory". Which one is right?
- [ ] Floor plan, ceiling height, camera positions or a scan of room KE E-470. The OptiTrack zone's position in the room (`src/content/zones/capture-volume.yaml`) is a placeholder.
- [ ] Device photos.
- [ ] UiS logo files and visual-profile rules. The colours and fonts in `src/styles/tokens.css` are provisional.
- [ ] Open Graph images: `public/og-default.png` is a generated placeholder shared by every page.

## Settings — `src/content/settings.yaml`

- [ ] Shared lab email address (none on the site now; footer and Collaborate buttons point to the researchers page).
- [ ] Building name and postal address (currently "Kjølv Egelands hus, Kristine Bonnevies vei 22, 4021 Stavanger"; please confirm).
- [ ] Visiting information.
- [ ] Social links, if any.

## Open questions (REQUIREMENTS §8)

- [ ] Hosting and domain: the name is now `m2ai-lab`. Rename the GitHub repository (currently `mai-lab`) to
      `m2ai-lab` so GitHub Pages serves it at `/m2ai-lab/`; a custom domain (e.g. a uis.no subdomain) still needs UiS IT.
- [ ] Is Norwegian needed at launch?
- [ ] Is equipment booking in scope later?
