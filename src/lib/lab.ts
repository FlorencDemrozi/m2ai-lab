/**
 * Loads every content collection once, checks the links between files, and computes the
 * reverse relations (e.g. "devices this researcher is responsible for").
 *
 * Schema errors (missing status, no researcher, wrong field types) are reported by Astro
 * from src/content.config.ts. This module adds the checks a schema can't do on its own:
 * that every referenced id actually exists. Any broken link fails the build.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { SOURCES, STATUSES } from './constants';

export type Device = CollectionEntry<'devices'>;
export type Researcher = CollectionEntry<'researchers'>;
export type Application = CollectionEntry<'applications'>;
export type Category = CollectionEntry<'categories'>;
export type Project = CollectionEntry<'projects'>;
export type Publication = CollectionEntry<'publications'>;
export type Zone = CollectionEntry<'zones'>;
export type Status = (typeof STATUSES)[number];
export type Source = (typeof SOURCES)[number];
export type StatusCounts = Record<Exclude<Status, 'retired'>, number>;

type Ref = { id: string };
type Sortable = { id: string; data: { order?: number } };

const byOrder = <T extends Sortable>(a: T, b: T) =>
  (a.data.order ?? 100) - (b.data.order ?? 100) || a.id.localeCompare(b.id);

function group<K extends string, V>(pairs: Array<[K, V]>): Map<K, V[]> {
  const m = new Map<K, V[]>();
  for (const [k, v] of pairs) {
    const list = m.get(k);
    if (list) {
      if (!list.includes(v)) list.push(v);
    } else m.set(k, [v]);
  }
  return m;
}

async function build() {
  const [devices, researchers, applications, categories, projects, publications, zones, settingsAll, homeAll] =
    await Promise.all([
      getCollection('devices'),
      getCollection('researchers'),
      getCollection('applications'),
      getCollection('categories'),
      getCollection('projects'),
      getCollection('publications'),
      getCollection('zones'),
      getCollection('settings'),
      getCollection('home'),
    ]);

  devices.sort(byOrder);
  researchers.sort(byOrder);
  applications.sort(byOrder);
  categories.sort(byOrder);

  const index = {
    devices: new Map(devices.map((e) => [e.id, e])),
    researchers: new Map(researchers.map((e) => [e.id, e])),
    applications: new Map(applications.map((e) => [e.id, e])),
    categories: new Map(categories.map((e) => [e.id, e])),
    projects: new Map(projects.map((e) => [e.id, e])),
  };

  // ---- link checks -------------------------------------------------------------------
  const errors: string[] = [];
  const check = (from: string, field: string, refs: Ref[], target: keyof typeof index) => {
    for (const r of refs) {
      if (!index[target].has(r.id)) {
        const known = [...index[target].keys()].join(', ') || '(none yet)';
        errors.push(`${from} → ${field}: "${r.id}" is not a known ${target} id. Known: ${known}`);
      }
    }
  };
  for (const d of devices) {
    const f = `src/content/devices/${d.id}.md`;
    check(f, 'categories', d.data.categories, 'categories');
    check(f, 'researchers', d.data.researchers, 'researchers');
    check(f, 'applications', d.data.applications, 'applications');
  }
  for (const p of projects) {
    const f = `src/content/projects/${p.id}.md`;
    check(f, 'devices', p.data.devices, 'devices');
    check(f, 'researchers', p.data.researchers, 'researchers');
    check(f, 'applications', p.data.applications, 'applications');
  }
  for (const p of publications) {
    const f = `src/content/publications/${p.id}.yaml`;
    check(f, 'projects', p.data.projects, 'projects');
    check(f, 'devices', p.data.devices, 'devices');
    check(f, 'researchers', p.data.researchers, 'researchers');
  }
  for (const z of zones) check(`src/content/zones/${z.id}.yaml`, 'devices', z.data.devices, 'devices');

  const settings = settingsAll.find((s) => s.id === 'lab');
  if (!settings) errors.push('src/content/settings.yaml must contain one entry with the id "lab".');
  const home = homeAll.find((h) => h.id === 'home');
  if (!home) errors.push('src/content/home.yaml must contain one entry with the id "home".');
  else check('src/content/home.yaml', 'highlights', home.data.highlights.map((h) => h.device), 'devices');

  if (errors.length) {
    throw new Error(`Content check failed (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  }

  // ---- build log notes ---------------------------------------------------------------
  const twinSeen = new Map<string, string>();
  const notInTwin: string[] = [];
  for (const d of devices) {
    const obj = d.data.twin_object;
    if (!obj) notInTwin.push(d.id);
    else if (twinSeen.has(obj)) console.warn(`[m2ai] twin_object "${obj}" is used by both ${twinSeen.get(obj)} and ${d.id}.`);
    else twinSeen.set(obj, d.id);
  }
  if (notInTwin.length) console.warn(`[m2ai] Not shown in the digital twin (no twin_object): ${notInTwin.join(', ')}`);
  const ph = [...devices, ...researchers, ...applications].filter((e) => e.data.placeholder).length;
  if (ph) console.warn(`[m2ai] ${ph} content files are marked placeholder: true (see TODO-content.md).`);

  // ---- reverse relations -------------------------------------------------------------
  const resolve = <T>(refs: Ref[], m: Map<string, T>) => refs.map((r) => m.get(r.id)!);

  const devicesByResearcher = group(devices.flatMap((d) => d.data.researchers.map((r) => [r.id, d] as [string, Device])));
  const devicesByApplication = group(devices.flatMap((d) => d.data.applications.map((a) => [a.id, d] as [string, Device])));
  const devicesByCategory = group(devices.flatMap((d) => d.data.categories.map((c) => [c.id, d] as [string, Device])));
  const projectsByDevice = group(projects.flatMap((p) => p.data.devices.map((d) => [d.id, p] as [string, Project])));
  const projectsByResearcher = group(projects.flatMap((p) => p.data.researchers.map((r) => [r.id, p] as [string, Project])));
  const projectsByApplication = group(projects.flatMap((p) => p.data.applications.map((a) => [a.id, p] as [string, Project])));
  const pubsByDevice = group(publications.flatMap((p) => p.data.devices.map((d) => [d.id, p] as [string, Publication])));
  const pubsByResearcher = group(publications.flatMap((p) => p.data.researchers.map((r) => [r.id, p] as [string, Publication])));
  const pubsByProject = group(publications.flatMap((p) => p.data.projects.map((r) => [r.id, p] as [string, Publication])));

  /** Lab views never show retired equipment. */
  const inLab = (list: Device[] = []) => list.filter((d) => d.data.status !== 'retired');

  const researchersOfDevices = (list: Device[]) => {
    const ids = new Set(list.flatMap((d) => d.data.researchers.map((r) => r.id)));
    return researchers.filter((r) => ids.has(r.id));
  };
  const applicationsOfDevices = (list: Device[]) => {
    const ids = new Set(list.flatMap((d) => d.data.applications.map((a) => a.id)));
    return applications.filter((a) => ids.has(a.id));
  };

  return {
    settings: settings!.data,
    devices,
    labDevices: inLab(devices),
    researchers,
    applications,
    categories,
    featuredCategories: categories.filter((c) => c.data.featured),
    home: home!.data,
    projects,
    publications,
    zones,

    device: {
      categories: (d: Device) => resolve(d.data.categories, index.categories),
      /** Icon key: the device's own, else its first category's. */
      icon: (d: Device) => d.data.icon ?? index.categories.get(d.data.categories[0].id)?.data.icon ?? 'compute',
      researchers: (d: Device) => resolve(d.data.researchers, index.researchers),
      applications: (d: Device) => resolve(d.data.applications, index.applications),
      projects: (d: Device) => projectsByDevice.get(d.id) ?? [],
      publications: (d: Device) => pubsByDevice.get(d.id) ?? [],
    },
    researcher: {
      devices: (r: Researcher) => inLab(devicesByResearcher.get(r.id)),
      applications: (r: Researcher) => applicationsOfDevices(inLab(devicesByResearcher.get(r.id))),
      projects: (r: Researcher) => projectsByResearcher.get(r.id) ?? [],
      publications: (r: Researcher) => pubsByResearcher.get(r.id) ?? [],
    },
    application: {
      devices: (a: Application) => inLab(devicesByApplication.get(a.id)),
      researchers: (a: Application) => researchersOfDevices(inLab(devicesByApplication.get(a.id))),
      projects: (a: Application) => projectsByApplication.get(a.id) ?? [],
    },
    category: {
      devices: (c: Category) => inLab(devicesByCategory.get(c.id)),
    },
    byId: (id: string) => index.devices.get(id),
    project: {
      publications: (p: Project) => pubsByProject.get(p.id) ?? [],
    },
  };
}

let cached: ReturnType<typeof build> | undefined;

/** The whole lab, loaded and checked once per build. */
export function loadLab() {
  cached ??= build();
  return cached;
}

export type Lab = Awaited<ReturnType<typeof build>>;

export function statusCounts(list: Device[]): StatusCounts {
  const c: StatusCounts = { installed: 0, acquiring: 0, planned: 0 };
  for (const d of list) if (d.data.status !== 'retired') c[d.data.status]++;
  return c;
}

/** Devices that can be used now (status `installed`), optionally excluding accessories. */
export function available(list: Device[], { accessories = true } = {}) {
  return list.filter((d) => d.data.status === 'installed' && (accessories || !d.data.accessory));
}
