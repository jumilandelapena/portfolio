/**
 * Site-wide constants. `SITE` and `BASE` are the single source of truth for the
 * GitHub Pages deployment (`astro.config.ts` imports them), and `url()` is the
 * only way internal links and asset paths are built.
 */
export const SITE = 'https://jumilandelapena.github.io';
export const BASE = '/portfolio';

export const SITE_TITLE = 'Jumilan L. Dela Peña';
export const SITE_DESCRIPTION =
  'Software Engineer at ClinicMind with deep test-automation expertise: Playwright and TypeScript, Angular and Node.js, and 440 merged merge requests on a US healthcare EHR platform. Licensed Electronics Engineer in the Philippines.';

export const PERSON = {
  name: 'Jumilan L. Dela Peña',
  honorific: 'Engr.',
  nickname: 'Jumi',
  jobTitle: 'Software Engineer',
  employer: 'ClinicMind',
  location: 'Philippines (remote)',
  email: 'jumilandelapenaece@gmail.com',
  alumniOf: 'University of Science and Technology of Southern Philippines',
} as const;

export const HERO = {
  headline: 'I build the feature and the test that proves it.',
  supporting:
    'Software Engineer at ClinicMind, a US healthcare EHR company. Playwright and TypeScript, Angular and Node.js, 440 merged MRs since October 2025.',
} as const;

export const REPO = {
  owner: 'jumilandelapena',
  name: 'portfolio',
  url: 'https://github.com/jumilandelapena/portfolio',
  actionsUrl: 'https://github.com/jumilandelapena/portfolio/actions',
} as const;

// public/resume.pdf is the Software Engineer / SDET résumé Jumi supplied on 2026-11-05.
export const RESUME_PATH = '/resume.pdf';

/** Join a site-relative path onto the configured base, never producing `//`. */
export function url(path = '/'): string {
  const base = BASE.replace(/\/+$/, '');
  if (path === '' || path === '/') return `${base}/`;
  if (path.startsWith('#')) return `${base}/${path}`;
  return `${base}/${path.replace(/^\/+/, '')}`;
}

/** Absolute URL for canonical links, Open Graph and JSON-LD. */
export function absoluteUrl(path = '/'): string {
  return new URL(url(path), SITE).toString();
}
