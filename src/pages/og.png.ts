import { readFileSync } from 'node:fs';
import path from 'node:path';

import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';

import { HERO, PERSON } from '../site.config';

const font = (file: string): Buffer =>
  readFileSync(path.resolve(process.cwd(), 'node_modules/@fontsource/inter/files', file));

/** Build-time Open Graph image: Deep Slate background, headline, name and role. */
export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#0f172a',
          color: '#f4f4f4',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '28px', color: '#818ea0' },
              children: [
                {
                  type: 'div',
                  props: { style: { width: '14px', height: '14px', borderRadius: '7px', backgroundColor: '#22d3ee' } },
                },
                {
                  type: 'div',
                  props: { children: `${PERSON.honorific} ${PERSON.name} · ${PERSON.jobTitle}, ${PERSON.employer}` },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '64px',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '1000px',
              },
              children: HERO.headline,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '26px', color: '#818ea0', lineHeight: 1.4, maxWidth: '1000px' },
              children: HERO.supporting,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: font('inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
        { name: 'Inter', data: font('inter-latin-700-normal.woff'), weight: 700, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
