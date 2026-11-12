/**
 * robots.txt: search engines welcome, AI-training and bulk-scraping crawlers asked to stay out.
 * Compliance is voluntary; this stops the well-behaved bots, not determined scrapers.
 * Note: crawlers only read robots.txt at the domain root, so it takes effect once the site
 * is served from its own domain (not a GitHub Pages /<repo>/ sub-path).
 */
import type { APIRoute } from 'astro';

const blocked = [
  // AI training / AI answer engines
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'Meta-ExternalFetcher', 'FacebookBot',
  'PerplexityBot', 'Perplexity-User', 'CCBot', 'cohere-ai', 'cohere-training-data-crawler',
  'Bytespider', 'Amazonbot', 'Diffbot', 'ImagesiftBot', 'Omgilibot', 'omgili', 'Timpibot',
  'YouBot', 'AI2Bot', 'Ai2Bot-Dolma', 'PetalBot', 'DuckAssistBot', 'MistralAI-User',
  // SEO / bulk scrapers
  'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'DataForSeoBot', 'BLEXBot',
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site).href;
  const body = [
    ...blocked.map((ua) => `User-agent: ${ua}\nDisallow: /\n`),
    'User-agent: *\nAllow: /\n',
    `Sitemap: ${sitemap}\n`,
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
