import { expect, test } from '../fixtures/test';

test.describe('links', () => {
  test('external links carry rel="noopener noreferrer" and never open a new tab silently', async ({ home }) => {
    const external = (await home.allLinks()).filter((l) => /^https?:\/\//.test(l.href));
    expect(external.length).toBeGreaterThan(50);
    for (const link of external) {
      expect.soft(link.rel, `${link.href} (${link.text})`).toContain('noopener');
      expect.soft(link.rel, `${link.href} (${link.text})`).toContain('noreferrer');
      expect.soft(link.target, `${link.href} (${link.text})`).not.toBe('_blank');
    }
  });

  test('every project, certificate and course link is a well-formed https URL', async ({ home }) => {
    const hrefs = [
      ...(await home.projectItems.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))),
      ...(await home.certificationLinks.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))),
      ...(await home.courseLinks.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))),
    ];
    expect(hrefs.length).toBeGreaterThan(70);
    for (const href of hrefs) {
      expect.soft(() => new URL(href), href).not.toThrow();
      expect.soft(href, href).toMatch(/^https:\/\/(github\.com|www\.coursera\.org)\//);
    }
  });

  test('the contact section offers email, LinkedIn and GitHub and no phone number', async ({ home, page }) => {
    await expect(home.emailLink).toHaveAttribute('href', 'mailto:jumilandelapenaece@gmail.com');
    const contact = page.getByRole('region', { name: 'Contact' });
    await expect(contact.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', /linkedin\.com/);
    await expect(contact.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', /github\.com/);
    expect(await page.locator('a[href^="tel:"]').count()).toBe(0);
  });
});
