import { expect, test } from '../fixtures/test';

test.describe('navigation', () => {
  test('every section link points at a section that exists', async ({ home }) => {
    const links = home.navLinks();
    await expect(links).toHaveCount(7);
    for (const link of await links.all()) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^\/portfolio\/#[a-z]+$/);
      const id = href?.split('#')[1] ?? '';
      await expect(home.section(id)).toBeAttached();
    }
  });

  test('a section link scrolls to its section and updates the hash', async ({ home, page }) => {
    await home.navLink('Impact').click();
    await expect(page).toHaveURL(/#impact$/);
    await expect(home.impact).toBeInViewport();
  });

  test('the header logo links back to the base path', async ({ home }) => {
    await expect(home.logo).toHaveAttribute('href', '/portfolio/');
  });

  test('the skip link appears on focus and moves focus to the main landmark', async ({ home, page }, testInfo) => {
    // Some WebKit builds do not move Tab focus to links (see tests/a11y/keyboard.spec.ts). When the
    // first Tab lands elsewhere, focus the link directly; the behaviour under test is the same from there.
    await page.keyboard.press('Tab');
    const reached = await home.skipLink.evaluate((el) => el === document.activeElement);
    testInfo.annotations.push({ type: 'tab-reaches-links', description: String(reached) });
    if (!reached) await home.skipLink.focus();
    await expect(home.skipLink).toBeFocused();
    await expect(home.skipLink).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(home.main).toBeFocused();
  });

  test('the hero reads the chosen headline and the résumé link resolves to a PDF', async ({ home, request }) => {
    await expect(home.heroHeading).toHaveText('I build the feature and the test that proves it.');
    const href = await home.resumeLink.getAttribute('href');
    expect(href).toBe('/portfolio/resume.pdf');
    const response = await request.get(href ?? '');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('both résumé links open the PDF in a new tab and say so to screen readers', async ({ home, page }) => {
    for (const link of [home.resumeLink, home.aboutResumeLink]) {
      await expect(link).toHaveAttribute('href', '/portfolio/resume.pdf');
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAccessibleName(/opens in a new tab/);
    }
    // The popup may still be about:blank when it is reported, and headless engines may turn a PDF
    // into a download and close it again, so the proof is the request the new tab makes.
    const before = page.url();
    const [popup, pdfRequest] = await Promise.all([
      page.waitForEvent('popup'),
      page.context().waitForEvent('request', (r) => new URL(r.url()).pathname === '/portfolio/resume.pdf'),
      home.resumeLink.click(),
    ]);
    expect(pdfRequest.frame().page()).not.toBe(page);
    expect(page.url()).toBe(before);
    await popup.close().catch(() => undefined);
  });

  test('the page never overflows horizontally', async ({ home, page }) => {
    await expect(home.heroHeading).toBeVisible();
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.clientWidth);
  });
});
