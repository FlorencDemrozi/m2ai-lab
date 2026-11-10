/**
 * Content schemas for the m²AI BMD Lab site.
 *
 * Every lab-specific fact lives in src/content/ and is validated here at build time.
 * Relations are stored on ONE side only (see README "Content model"); reverse links
 * and cross-file checks (does the referenced id exist?) are done in src/lib/lab.ts.
 */
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { SOURCES, STATUSES, SYNC } from './lib/constants';


/** A text field with English and optional Norwegian. A plain string means English only. */
const localized = z
  .union([z.string(), z.object({ en: z.string(), no: z.string().optional() })])
  .transform((v) => (typeof v === 'string' ? { en: v } : v));

/** Marks dummy data. Anything with `placeholder: true` must be listed in TODO-content.md. */
const placeholder = z.boolean().default(false);

const devices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devices' }),
  schema: ({ image }) =>
    z.object({
      name: localized,
      summary: localized,
      status: z.enum(STATUSES, {
        error: (issue) =>
          issue.input === undefined
            ? 'Every device needs a `status`: installed | acquiring | planned | retired.'
            : `Unknown status "${String(issue.input)}". Use installed | acquiring | planned | retired.`,
      }),
      /** For `acquiring`: when it is expected, e.g. "2027-01" or "Q1 2027". */
      expected: z.string().optional(),
      /** Where the item comes from: lab | personal | shared-uis | collaboration. */
      source: z.enum(SOURCES, {
        error: (issue) => `Unknown source "${String(issue.input)}". Use lab | personal | shared-uis | collaboration.`,
      }).default('lab'),
      /** For shared-uis / collaboration: the lab that makes it available. */
      partner: localized.optional(),
      categories: z
        .array(reference('categories'))
        .min(1, 'Every device needs at least one category (`categories: [id]`).'),
      researchers: z
        .array(reference('researchers'), {
          error: 'Every device needs `researchers: [id, ...]` (at least one responsible researcher).',
        })
        .min(1, 'Every device needs at least one responsible researcher (`researchers: [id]`).'),
      applications: z.array(reference('applications')).default([]),
      manufacturer: z.string().optional(),
      model: z.string().optional(),
      quantity: z.number().int().positive().optional(),
      /** Shown instead of a number when the quantity varies, e.g. "Various" or "1 licence". */
      quantity_note: localized.optional(),
      /** Official product page, shown as a "More info" button. Never hotlink its images. */
      url: z.url().optional(),
      /** Icon key (src/components/Icon.astro). Defaults to the first category's icon. */
      icon: z.string().optional(),
      /** Accessories (straps, cables, adapters) are listed compactly, not as full cards on the home page. */
      accessory: z.boolean().default(false),
      specs: z.record(z.string(), z.unknown()).default({}),
      sync: z.enum(SYNC).default('unknown'),
      acquired: z.coerce.date().optional(),
      booking_notes: localized.optional(),
      image: image().optional(),
      image_alt: localized.optional(),
      /** Name of the object (or group) in the 3D model / 2D hotspot layer. */
      twin_object: z.string().optional(),
      /** Sort order inside lists; lower first. */
      order: z.number().default(100),
      placeholder,
    }),
});

/** Equipment categories: filter tags on the equipment page and the home-page tiles. */
const categories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/categories' }),
  schema: z.object({
    name: localized,
    /** Short name for signal lanes and filter chips, e.g. "EMG". */
    short: z.string(),
    subtitle: localized,
    /** Icon key, see src/components/Icon.astro. */
    icon: z.string(),
    /** false keeps it off the home-page tiles and the signal monitor (e.g. cables and power). */
    featured: z.boolean().default(true),
    /** Signal-monitor lane: trace shape and the rate label shown next to it. */
    signal: z
      .object({
        shape: z.enum(['mocap', 'emg', 'eeg', 'gaze', 'thermal', 'rf', 'imu', 'audio', 'pulse']),
        rate: z.string().optional(),
      })
      .optional(),
    order: z.number(),
  }),
});

/** Copy for the home page sections (lab facts, so it lives in content, not components). */
const home = defineCollection({
  loader: file('./src/content/home.yaml'),
  schema: z.object({
    hero_intro: localized,
    sync_label: localized,
    highlights: z
      .array(z.object({ device: reference('devices'), label: localized }))
      .default([]),
    twin_heading: localized,
    twin_intro: localized,
    unique_eyebrow: localized,
    unique_heading: localized,
    unique_body: localized,
    pipeline: z.array(z.object({ title: localized, body: localized, icon: z.string() })).min(1),
    categories_heading: localized,
    categories_intro: localized,
    applications_heading: localized,
    researchers_heading: localized,
    collaborate_heading: localized,
    collaborate_body: localized,
    placeholder_fields: z.array(z.string()).default([]),
  }),
});

const applications = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/applications' }),
  schema: ({ image }) =>
    z.object({
      name: localized,
      description: localized,
      image: image().optional(),
      order: z.number(),
      placeholder,
    }),
});

const researchers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/researchers' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: localized.optional(),
      photo: image().optional(),
      expertise: z.array(z.string()).default([]),
      email: z.email().optional(),
      profile_url: z.url().optional(),
      orcid: z
        .string()
        .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, 'ORCID must look like 0000-0002-1825-0097')
        .optional(),
      active: z.boolean().default(true),
      /** Only publish the photo once the person has agreed. */
      consent: z.boolean().default(false),
      order: z.number().default(100),
      placeholder,
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: localized,
    acronym: z.string().optional(),
    funder: z.string().optional(),
    start: z.coerce.date().optional(),
    end: z.coerce.date().optional(),
    summary: localized.optional(),
    url: z.url().optional(),
    devices: z.array(reference('devices')).default([]),
    researchers: z.array(reference('researchers')).default([]),
    applications: z.array(reference('applications')).default([]),
    placeholder,
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    year: z.number().int(),
    doi: z.string().optional(),
    url: z.url().optional(),
    dataset_url: z.url().optional(),
    projects: z.array(reference('projects')).default([]),
    devices: z.array(reference('devices')).default([]),
    researchers: z.array(reference('researchers')).default([]),
    placeholder,
  }),
});

const zones = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/zones' }),
  schema: z.object({
    name: localized,
    description: localized.optional(),
    /** Floor rectangle in metres, origin at the room's reference corner. */
    rect: z.object({ x: z.number(), y: z.number(), width: z.number(), depth: z.number() }),
    devices: z.array(reference('devices')).default([]),
    placeholder,
  }),
});

/**
 * The 2D digital-twin scene: room size and one shape per `twin_object`, in metres
 * (origin = the room's back-left floor corner; x to the right, y towards the viewer, z up).
 * Shapes are drawn as isometric boxes until the Blender render replaces the drawing;
 * hotspots keep working either way. Objects without `object` are decoration.
 */
const TWIN_KINDS = ['box', 'desk', 'workstation', 'tripod', 'rack', 'cart', 'plate', 'camera-array', 'anchors', 'person', 'scanner'] as const;
const twin = defineCollection({
  loader: file('./src/content/twin.yaml'),
  schema: z.object({
    room: z.object({ width: z.number().positive(), depth: z.number().positive(), height: z.number().positive() }),
    objects: z.array(
      z.object({
        /** Matches a device's `twin_object`. Omit for decoration (furniture, a participant). */
        object: z.string().optional(),
        kind: z.enum(TWIN_KINDS),
        x: z.number(),
        y: z.number(),
        z: z.number().default(0),
        w: z.number().positive(),
        d: z.number().positive(),
        h: z.number().positive(),
        /** camera-array / anchors: how many units around the rectangle. */
        count: z.number().int().positive().optional(),
      }),
    ),
    placeholder,
  }),
});

const settings = defineCollection({
  loader: file('./src/content/settings.yaml'),
  schema: z.object({
    lab_name: z.string(),
    lab_slug: z.string().regex(/^[a-z0-9-]+$/),
    lab_full_name: localized,
    tagline: localized,
    lab_email: z.email(),
    institution: localized,
    institution_url: z.url(),
    department: localized,
    room: z.string(),
    address: z.array(z.string()),
    visiting: localized.optional(),
    optitrack_area_m: z.tuple([z.number(), z.number()]),
    social: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    placeholder_fields: z.array(z.string()).default([]),
  }),
});

/** Free-text pages (About, Accessibility, …). One file per language: pages/en/about.md, pages/no/about.md. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    placeholder,
  }),
});

export const collections = {
  devices,
  categories,
  home,
  applications,
  researchers,
  projects,
  publications,
  zones,
  twin,
  settings,
  pages,
};
