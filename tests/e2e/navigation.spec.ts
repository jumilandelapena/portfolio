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

  test('the skip link appears on focus and moves focus to the main landmark', async ({ home, page, browserName }) => {
    // Headless WebKit does not move Tab focus to links (see tests/a11y/keyboard.spec.ts), so it
    // focuses the link directly; the behaviour under test is the same from that point on.
    if (browserName === 'webkit') await home.skipLink.focus();
    else await page.keyboard.press('Tab');
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
});
