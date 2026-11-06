import { expect, test } from '../fixtures/test';

test.describe('projects', () => {
  test('the autofix agent leads the featured grid with its code and demo links', async ({ home }) => {
    const firstCard = home.projects.locator('[data-filter-items] article').first();
    await expect(firstCard).toHaveAttribute('id', 'project-autofix-agent');

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
