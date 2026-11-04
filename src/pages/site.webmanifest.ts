import type { APIRoute } from 'astro';

import { PERSON, url } from '../site.config';

/** Generated so icon paths respect the configured base. */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: `${PERSON.name} portfolio`,
        short_name: PERSON.nickname,
        start_url: url('/'),
        display: 'browser',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: url('/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: url('/icon-512.png'), sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
