import { content } from '../fixtures/content';
import { expect, test } from '../fixtures/test';

const number = new Intl.NumberFormat('en-US');

test.describe('content collections render completely', () => {
  test('every project entry is on the page with its repository link, or marked private with no link', async ({
    home,
  }) => {
    expect(content.projects.length).toBeGreaterThanOrEqual(10);
    for (const project of content.projects) {
      const item = home.project(project.id);
      const titleLink = item.getByRole('link', { name: project.title, exact: true });
      await expect(item, project.id).toBeAttached();
      if (project.private) {
        expect(project.repo, `${project.id} is private`).toBeUndefined();
        expect(project.url, `${project.id} is private`).toBeUndefined();
        await expect(item.getByText(project.title, { exact: true }), project.id).toBeAttached();
        await expect(titleLink, project.id).toHaveCount(0);
        await expect(home.projectMeta(project.id), project.id).toHaveText('Private repository');
      } else {
        if (!project.url) throw new Error(`${project.id}: a public project needs its url`);
        await expect(titleLink, project.id).toHaveAttribute('href', project.url);
        await expect(home.projectMeta(project.id), project.id).not.toContainText('Private');
      }
      for (const link of project.links ?? []) {
        await expect(
          item.getByRole('link', { name: link.label, exact: true }),
          `${project.id} ${link.label}`,
        ).toHaveAttribute('href', link.url);
      }
    }
  });

  test('every certification and every course link is present and exact', async ({ home }) => {
    expect(content.certifications.length).toBe(7);
    expect(content.courses.length).toBe(53);
    for (const cert of content.certifications) {
      const item = home.certification(cert.id);
      await expect(item, cert.id).toBeAttached();
      if (cert.url) {
        await expect(item.getByTestId('certification-link'), cert.id).toHaveAttribute('href', cert.url);
      }
      const courses = content.courses.filter((c) => c.certification === cert.id);
      const rendered = item.getByTestId('course-link');
      await expect(rendered, cert.id).toHaveCount(courses.length);
      for (const course of courses) {
        await expect(rendered.filter({ hasText: course.title }).first(), course.id).toHaveAttribute('href', course.url);
      }
    }
  });

  test('the work impact numbers match the data file, with their as-of date and source', async ({ home }) => {
    const [impact] = content.impact;
    if (!impact) throw new Error('impact data missing');
    await expect(home.impactStats).toHaveCount(impact.stats.length);
    for (const stat of impact.stats) {
      const tile = home.impactStats
        .filter({ has: home.page.locator(`[data-value="${stat.value}"]`) })
        .or(home.page.locator(`[data-testid="impact-stat"][data-value="${stat.value}"]`));
      await expect(tile.first(), stat.label).toContainText(number.format(stat.value));
      await expect(tile.first(), stat.label).toContainText(stat.label);
    }
    await expect(home.impactAsOf).toContainText(impact.source);
    await expect(home.impactAsOf.locator('time')).toHaveAttribute('datetime', impact.asOf);
  });

  test('every experience entry and social profile renders', async ({ home }) => {
    for (const role of content.experience) {
      const item = home.page.locator(`#experience-${role.id}`);
      await expect(item, role.id).toBeAttached();
      await expect(item.getByRole('heading', { level: 3 }), role.id).toHaveText(role.role);
      await expect(item, role.id).toContainText(role.org);
    }
    const profiles = home.page.getByRole('list', { name: 'Profiles' });
    for (const social of content.socials) {
      await expect(profiles.getByRole('link', { name: social.label, exact: true }), social.id).toHaveAttribute(
        'href',
        social.url,
      );
    }
  });
});
