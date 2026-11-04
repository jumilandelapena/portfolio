/**
 * Render public/favicon.svg to the PNG sizes the manifest and Apple need.
 * Run with `pnpm favicons` after changing the SVG; the PNGs are committed.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..', 'public');
const svg = readFileSync(path.join(root, 'favicon.svg'));

const targets: readonly (readonly [string, number])[] = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [name, size] of targets) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(root, name));
  console.log(`wrote public/${name} (${size}x${size})`);
}
