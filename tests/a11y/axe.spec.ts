import type AxeBuilder from '@axe-core/playwright';

import { expect, test } from '../fixtures/test';
import { type Theme } from '../pages/BasePage';

const pages = [
  { name: 'home', path: './' },
  { name: '404', path: '404.html' },
] as const;

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type Violation = AxeResults['violations'][number];

function blocking(violations: Violation[]): Violation[] {
  return violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

for (const theme of ['dark', 'light'] as const satisfies readonly Theme[]) {
  test.describe(`axe, ${theme} theme`, () => {
    test.use({ theme });

    for (const target of pages) {
      test(`${target.name} page has no serious or critical violations`, async ({ page, home, axe }, testInfo) => {
        if (target.path !== './') await page.goto(target.path);
        expect(await home.currentTheme()).toBe(theme);

        const results = await axe().analyze();
        const serious = blocking(results.violations);
        testInfo.annotations.push({ type: 'axe-violations', description: String(serious.length) });
        if (results.violations.length > 0) {
          await testInfo.attach(`axe-${target.name}-${theme}.json`, {
            body: JSON.stringify(results.violations, null, 2),
            contentType: 'application/json',
          });
        }
        expect(
          serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
        ).toEqual([]);
      });
    }
  });
}
