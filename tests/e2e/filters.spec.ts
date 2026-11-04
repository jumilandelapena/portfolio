import { expect, test } from '../fixtures/test';

test.describe('filters', () => {
  test('project filters show only the projects tagged with that area', async ({ home }) => {
    const total = await home.projectItems.count();
    expect(total).toBeGreaterThan(0);
    await expect(home.projectCount).toHaveText(`${total} of ${total}`);

    await home.projectFilter('Testing').click();
    await expect(home.projectFilter('Testing')).toHaveAttribute('aria-pressed', 'true');
    await expect(home.projectFilter('All')).toHaveAttribute('aria-pressed', 'false');

    let shown = 0;
    for (const item of await home.projectItems.all()) {
      const areas = ((await item.getAttribute('data-areas')) ?? '').split(' ');
      if (areas.includes('testing')) {
        await expect(item).toBeVisible();
        shown += 1;
      } else {
        await expect(item).toBeHidden();
      }
    }
    expect(shown).toBeGreaterThan(0);
    await expect(home.projectCount).toHaveText(`${shown} of ${total}`);

    await home.projectFilter('All').click();
    for (const item of await home.projectItems.all()) await expect(item).toBeVisible();
    await expect(home.projectCount).toHaveText(`${total} of ${total}`);
  });

  test('certification filters work the same way', async ({ home }) => {
    const total = await home.certificationItems.count();
    await home.certificationFilter('PM').click();
    for (const item of await home.certificationItems.all()) {
      const areas = ((await item.getAttribute('data-areas')) ?? '').split(' ');
      if (areas.includes('pm')) await expect(item).toBeVisible();
      else await expect(item).toBeHidden();
    }
    await expect(home.certificationCount).toHaveText(`1 of ${total}`);
  });
});
