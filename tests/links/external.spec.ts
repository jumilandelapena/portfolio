import { expect, test } from '../fixtures/test';

/**
 * Checks every outbound link. Slow and dependent on third parties, so it is
 * skipped unless CHECK_EXTERNAL_LINKS=1 and runs in its own non-blocking CI job.
 */
test.describe('external links @external', () => {
  test.skip(!process.env['CHECK_EXTERNAL_LINKS'], 'set CHECK_EXTERNAL_LINKS=1 to run the external link check');
  test.setTimeout(10 * 60 * 1000);

  test('every outbound link answers with a non-error status', async ({ home, request }) => {
    const urls = [...new Set((await home.allLinks()).map((l) => l.href).filter((h) => /^https?:\/\//.test(h)))];
    const failures: string[] = [];
    for (const url of urls) {
      try {
        const response = await request.get(url, { maxRedirects: 5, timeout: 20_000 });
        const status = response.status();
        if (status >= 400 && status !== 429) failures.push(`${status} ${url}`);
      } catch (error) {
        failures.push(`${error instanceof Error ? error.message : String(error)} ${url}`);
      }
    }
    console.log(`checked ${urls.length} external links`);
    expect(failures, failures.join('\n')).toEqual([]);
  });
});
