import { expect, test } from '../fixtures/test';

test.describe('projects', () => {
  test('the anomaly sentinel leads the featured grid, followed by the autofix agent', async ({ home }) => {
    const cards = home.projects.locator('[data-filter-items] article');
    await expect(cards.nth(0)).toHaveAttribute('id', 'project-anomaly-sentinel');
    await expect(cards.nth(1)).toHaveAttribute('id', 'project-autofix-agent');
  });

  test('the anomaly sentinel card links the code, eval results and demo, and states its eval result', async ({
    home,
  }) => {
    const card = home.project('anomaly-sentinel');
    await expect(card.getByRole('link', { name: 'Code' })).toHaveAttribute(
      'href',
      'https://github.com/jumilandelapena/anomaly-sentinel',
    );
    await expect(card.getByRole('link', { name: 'Eval results' })).toHaveAttribute('href', /docs\/eval-results\.md$/);
    await expect(card.getByRole('link', { name: 'Demo GIF' })).toHaveAttribute('href', /docs\/demo\.gif$/);
    await expect(card).toContainText('8/8 incidents detected');
  });

  test('the autofix agent card keeps its code and demo links and key claims', async ({ home }) => {
    const card = home.project('autofix-agent');
    await expect(card.getByRole('link', { name: 'Code' })).toHaveAttribute(
      'href',
      'https://github.com/jumilandelapena/autofix-agent',
    );
    await expect(card.getByRole('link', { name: 'Agent PRs on the demo repo' })).toHaveAttribute(
      'href',
      /demo-inventory-api\/pulls/,
    );
    await expect(card).toContainText('6/6 fixed');
    await expect(card).toContainText('It never merges.');
  });
});
