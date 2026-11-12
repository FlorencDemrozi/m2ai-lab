/**
 * Interface strings only (buttons, labels, headings that are part of the site chrome).
 * Lab facts and descriptions belong in src/content/, not here.
 * Norwegian strings were drafted by Claude and need review by a native speaker.
 */
export const LOCALES = ['en', 'no'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP 47 tags for <html lang> and hreflang. */
export const LANG_TAG: Record<Locale, string> = { en: 'en', no: 'nb' };

const en = {
  'site.skip': 'Skip to content',
  'nav.equipment': 'Equipment',
  'nav.applications': 'Applications',
  'nav.researchers': 'Researchers',
  'nav.partners': 'Partners',
  'nav.about': 'About',
  'nav.collaborate': 'Collaborate',
  'nav.menu': 'Menu',
  'nav.primary': 'Main',
  'lang.switch': 'Norsk',
  'lang.switchLabel': 'Les på norsk',
  'theme.toggle': 'Switch colour theme',

  'status.installed': 'Available',
  'status.acquiring': 'Being acquired',
  'status.planned': 'Planned',
  'status.retired': 'Retired',
  'status.expected': 'expected',
  'status.unconfirmed': 'Unconfirmed',
  'status.unconfirmedHint': 'Details on this page are not yet confirmed.',

  'source.lab': 'Lab-owned',
  'source.personal': 'PI collection',
  'source.shared-uis': 'Shared at UiS',
  'source.collaboration': 'Via collaboration',
  'source.hint.lab': 'Purchased for the lab.',
  'source.hint.personal': 'From the PI’s own collection, available for lab use.',
  'source.hint.shared-uis': 'Available through other labs at UiS.',
  'source.hint.collaboration': 'Available through a partner lab.',

  'sync.hardware': 'Hardware sync',
  'sync.software': 'Software sync',
  'sync.none': 'No sync',
  'sync.unknown': 'Sync not specified',

  'device.source': 'Availability',
  'device.partner': 'Through',
  'device.url': 'More info',
  'device.urlHint': 'manufacturer’s site, opens externally',
  'device.applications': 'Applications',
  'device.researchers': 'Responsible researchers',
  'device.specs': 'Key specifications',
  'device.manufacturer': 'Manufacturer',
  'device.model': 'Model',
  'device.quantity': 'Quantity',
  'device.sync': 'Synchronization',
  'device.acquired': 'Acquired',
  'device.booking': 'Booking',
  'device.projects': 'Projects',
  'device.publications': 'Publications',
  'device.more': 'More details',

  'catalogue.title': 'Equipment',
  'catalogue.description': 'Everything the lab can record with: what we own, what we share at UiS, and what partners make available.',
  'catalogue.filters': 'Filter equipment',
  'catalogue.filterCategory': 'Category',
  'catalogue.filterSource': 'Availability',
  'catalogue.all': 'All',
  'catalogue.showing': 'Showing {n} of {total} items',
  'catalogue.empty': 'Nothing matches these filters.',
  'catalogue.reset': 'Clear filters',
  'catalogue.planned': 'Planned additions',
  'catalogue.plannedIntro': 'On the wish list, not yet in the lab.',
  'catalogue.jump': 'Jump to a category',

  'researchers.title': 'Researchers',
  'researchers.description': 'The people behind the lab: their expertise and how to reach them.',
  'researcher.devices': 'Responsible for',
  'researcher.applications': 'Applications',
  'researcher.expertise': 'Expertise',
  'researcher.profile': 'UiS profile',
  'researcher.orcid': 'ORCID',
  'researcher.emailTo': 'Email {name}',
  'researcher.none': 'No equipment listed yet.',

  'applications.title': 'Applications',
  'applications.description': 'What the lab is used for, and which systems each application draws on.',
  'application.devices': 'Systems used',
  'application.researchers': 'Researchers involved',

  'categories.title': 'Categories',
  'category.devices': 'Equipment',
  'count.installed': '{n} available',
  'count.acquiring': '{n} being acquired',
  'count.planned': '{n} planned',
  'count.none': 'No systems yet',

  'home.explore': 'Explore the equipment',
  'home.collaborate': 'Collaborate with us',
  'home.statAvailable': 'items available now',
  'home.statCategories': 'sensing categories',
  'home.monitor': 'Illustration of synchronized signal streams: {lanes}. All share one clock.',
  'home.live': 'Synchronized',
  'home.pipeline': 'From signals to multimodal AI',
  'home.allResearchers': 'All researchers',

  'twin.labels': 'Show all devices',
  'twin.planned': 'Show planned devices',
  'twin.volume': 'Show capture volume',
  'twin.map': 'Map of the lab. Each device is a link; with JavaScript, Enter opens its details here and Esc closes them.',
  'twin.close': 'Close details',
  'twin.hint': 'Select a device for details. Keyboard: Tab between devices, Enter to open, Esc to close.',
  'twin.placeholder': 'The room layout is illustrative until the lab has been measured.',
  'twin.view3d': '3D view',
  'twin.view2d': '2D map',
  'twin.app': 'Highlight',
  'twin.appAll': 'All applications',
  'twin.hint3d': 'Drag to rotate, scroll to zoom (on touch screens: two fingers). Tab moves between devices, Enter opens details, Esc closes them.',

  'footer.contact': 'Contact',
  'footer.visit': 'Visit',
  'footer.accessibility': 'Accessibility statement',
  'footer.privacy': 'This site uses no cookies and no tracking.',

  'notfound.title': 'Page not found',
  'notfound.body': 'This page does not exist, or has moved.',
  'notfound.home': 'Go to the home page',
} as const;

export type UiKey = keyof typeof en;

const no: Partial<Record<UiKey, string>> = {
  'site.skip': 'Hopp til innhold',
  'nav.equipment': 'Utstyr',
  'nav.applications': 'Bruksområder',
  'nav.researchers': 'Forskere',
  'nav.partners': 'Partnere',
  'nav.about': 'Om',
  'nav.collaborate': 'Samarbeid',
  'nav.menu': 'Meny',
  'nav.primary': 'Hovedmeny',
  'lang.switch': 'English',
  'lang.switchLabel': 'Read in English',
  'theme.toggle': 'Bytt fargetema',

  'status.installed': 'Tilgjengelig',
  'status.acquiring': 'Under anskaffelse',
  'status.planned': 'Planlagt',
  'status.retired': 'Utfaset',
  'status.expected': 'forventet',
  'status.unconfirmed': 'Ikke bekreftet',
  'status.unconfirmedHint': 'Opplysningene på denne siden er ikke bekreftet ennå.',

  'source.lab': 'Labens eget',
  'source.personal': 'Leders samling',
  'source.shared-uis': 'Delt ved UiS',
  'source.collaboration': 'Via samarbeid',
  'source.hint.lab': 'Kjøpt inn til laben.',
  'source.hint.personal': 'Fra prosjektleders egen samling, tilgjengelig for laben.',
  'source.hint.shared-uis': 'Tilgjengelig gjennom andre laber ved UiS.',
  'source.hint.collaboration': 'Tilgjengelig gjennom en samarbeidslab.',

  'sync.hardware': 'Maskinvaresynkronisering',
  'sync.software': 'Programvaresynkronisering',
  'sync.none': 'Ingen synkronisering',
  'sync.unknown': 'Synkronisering ikke oppgitt',

  'device.source': 'Tilgang',
  'device.partner': 'Gjennom',
  'device.url': 'Mer info',
  'device.urlHint': 'produsentens nettsted, åpnes eksternt',
  'device.applications': 'Bruksområder',
  'device.researchers': 'Ansvarlige forskere',
  'device.specs': 'Nøkkeldata',
  'device.manufacturer': 'Produsent',
  'device.model': 'Modell',
  'device.quantity': 'Antall',
  'device.sync': 'Synkronisering',
  'device.acquired': 'Anskaffet',
  'device.booking': 'Booking',
  'device.projects': 'Prosjekter',
  'device.publications': 'Publikasjoner',
  'device.more': 'Mer informasjon',

  'catalogue.title': 'Utstyr',
  'catalogue.description': 'Alt laben kan måle med: det vi eier, det vi deler ved UiS, og det partnere gjør tilgjengelig.',
  'catalogue.filters': 'Filtrer utstyr',
  'catalogue.filterCategory': 'Kategori',
  'catalogue.filterSource': 'Tilgang',
  'catalogue.all': 'Alle',
  'catalogue.showing': 'Viser {n} av {total}',
  'catalogue.empty': 'Ingenting passer med disse filtrene.',
  'catalogue.reset': 'Nullstill filtre',
  'catalogue.planned': 'Planlagte anskaffelser',
  'catalogue.plannedIntro': 'På ønskelisten, ikke i laben ennå.',
  'catalogue.jump': 'Gå til kategori',

  'researchers.title': 'Forskere',
  'researchers.description': 'Menneskene bak laben: fagfelt og kontaktinformasjon.',
  'researcher.devices': 'Ansvarlig for',
  'researcher.applications': 'Bruksområder',
  'researcher.expertise': 'Fagfelt',
  'researcher.profile': 'Profil på uis.no',
  'researcher.orcid': 'ORCID',
  'researcher.emailTo': 'Send e-post til {name}',
  'researcher.none': 'Ingen utstyr registrert ennå.',

  'applications.title': 'Bruksområder',
  'applications.description': 'Hva laben brukes til, og hvilke systemer hvert bruksområde bygger på.',
  'application.devices': 'Systemer som brukes',
  'application.researchers': 'Forskere',

  'categories.title': 'Kategorier',
  'category.devices': 'Utstyr',
  'count.installed': '{n} tilgjengelig',
  'count.acquiring': '{n} under anskaffelse',
  'count.planned': '{n} planlagt',
  'count.none': 'Ingen systemer ennå',

  'home.explore': 'Se utstyret',
  'home.collaborate': 'Samarbeid med oss',
  'home.statAvailable': 'enheter tilgjengelig nå',
  'home.statCategories': 'målekategorier',
  'home.monitor': 'Illustrasjon av synkroniserte signalstrømmer: {lanes}. Alle deler én klokke.',
  'home.live': 'Synkronisert',
  'home.pipeline': 'Fra signaler til multimodal KI',
  'home.allResearchers': 'Alle forskere',

  'twin.labels': 'Vis alle navn',
  'twin.planned': 'Vis planlagt utstyr',
  'twin.volume': 'Vis opptaksområdet',
  'twin.map': 'Kart over laben. Hvert utstyr er en lenke; med JavaScript åpner Enter detaljene her og Esc lukker dem.',
  'twin.close': 'Lukk detaljer',
  'twin.hint': 'Velg utstyr for detaljer. Tastatur: Tab mellom utstyr, Enter for å åpne, Esc for å lukke.',
  'twin.placeholder': 'Romoppsettet er illustrativt til laben er målt opp.',
  'twin.view3d': '3D-visning',
  'twin.view2d': '2D-kart',
  'twin.app': 'Fremhev',
  'twin.appAll': 'Alle bruksområder',
  'twin.hint3d': 'Dra for å rotere, rull for å zoome (på berøringsskjerm: to fingre). Tab flytter mellom utstyr, Enter åpner detaljer, Esc lukker.',

  'footer.contact': 'Kontakt',
  'footer.visit': 'Besøk',
  'footer.accessibility': 'Tilgjengelighetserklæring',
  'footer.privacy': 'Nettstedet bruker ingen informasjonskapsler og ingen sporing.',

  'notfound.title': 'Fant ikke siden',
  'notfound.body': 'Siden finnes ikke, eller den er flyttet.',
  'notfound.home': 'Gå til forsiden',
};

const dict: Record<Locale, Partial<Record<UiKey, string>>> = { en, no };

/** Translator for one locale. Missing Norwegian strings fall back to English. */
export function useT(locale: Locale) {
  return (key: UiKey, vars: Record<string, string | number> = {}) => {
    let s = dict[locale][key] ?? en[key];
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Pick the right language from a content field `{ en, no? }`, falling back to English. */
export function pick(field: { en: string; no?: string } | undefined, locale: Locale): string {
  if (!field) return '';
  return (locale === 'no' && field.no) || field.en;
}

/** Route param for `[...locale]` pages: English lives at the root, Norwegian under /no/. */
export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

export function toLocale(param: string | undefined): Locale {
  return param === 'no' ? 'no' : 'en';
}

/** Internal link with the deploy base path, locale prefix and trailing slash. */
export function href(locale: Locale, ...segments: string[]): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const parts = [locale === DEFAULT_LOCALE ? '' : locale, ...segments].filter(Boolean);
  return `${base}/${parts.join('/')}${parts.length ? '/' : ''}`;
}

/** Static paths for every locale, for pages without other params. */
export function localePaths() {
  return LOCALES.map((locale) => ({ params: { locale: localeParam(locale) }, props: { locale } }));
}
