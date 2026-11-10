// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH are set by the deploy workflow (e.g. GitHub Pages project sites
// live under /<repo>/). Locally the site is served from the root.
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Scoped styles via a class instead of a data attribute on every element (smaller HTML).
  scopedStyleStrategy: 'class',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', no: 'nb' } },
    }),
  ],
});
