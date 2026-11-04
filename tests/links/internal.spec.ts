import { expect, test } from '../fixtures/test';

test.describe('internal links', () => {
  test('every same-site link and hash target resolves', async ({ home, page, request }) => {
    const links = (await home.allLinks()).filter((l) => !/^(https?:|mailto:)/.test(l.href));
    expect(links.length).toBeGreaterThan(10);

    const checked = new Set<string>();
    for (const link of links) {
      if (checked.has(link.href)) continue;
      checked.add(link.href);

      const hashAt = link.href.indexOf('#');
      const hash = hashAt >= 0 ? link.href.slice(hashAt + 1) : '';
      const pathPart = hashAt >= 0 ? link.href.slice(0, hashAt) : link.href;

      if (hash) {
        expect.soft(hash, `hash from "${link.text}"`).toMatch(/^[A-Za-z][\w-]*$/);
        expect.soft(await page.locator(`[id="${hash}"]`).count(), `#${hash} from "${link.text}"`).toBe(1);
      }
      if (pathPart && pathPart !== '/portfolio/') {
        const response = await request.get(pathPart);
        expect.soft(response.status(), `${pathPart} from "${link.text}"`).toBe(200);
      }
      expect.soft(link.href, `"${link.text}" must stay under the base path`).toMatch(/^(\/portfolio\/|#)/);
    }
  });

  test('metadata endpoints exist under the base path', async ({ request }) => {
    for (const file of [
      'robots.txt',
      'sitemap-index.xml',
      'site.webmanifest',
      'og.png',
      'favicon.svg',
      'favicon-32.png',
    ]) {
      const response = await request.get(file);
      expect.soft(response.status(), file).toBe(200);
    }
  });
});
