import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

import { expect, test } from '../fixtures/test';

/**
 * Checks every outbound link. Slow and dependent on third parties, so it is
 * skipped unless CHECK_EXTERNAL_LINKS=1 and runs in its own non-blocking CI job.
 *
 * Plain Node requests are used instead of Playwright's request context because
 * some sites (YouTube) answer with headers larger than its parser accepts.
 * Hosts that block automated clients (LinkedIn answers 999, others 403 or 429)
 * are reported as blocked, not broken: a human can open them, a bot cannot.
 */
const BLOCKED_STATUSES = new Set([403, 429, 999]);

interface Probe {
  status: number | null;
  error?: string;
}

function probe(url: string, redirects = 0): Promise<Probe> {
  return new Promise((resolve) => {
    const target = new URL(url);
    const doRequest = target.protocol === 'https:' ? httpsRequest : httpRequest;
    const req = doRequest(
      target,
      {
        method: 'GET',
        maxHeaderSize: 256 * 1024,
        timeout: 20_000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; portfolio-link-check/1.0; +https://jumilandelapena.github.io/portfolio/)',
          Accept: 'text/html,*/*;q=0.8',
        },
      },
      (res) => {
        const status = res.statusCode ?? null;
        res.resume();
        if (status && status >= 300 && status < 400 && res.headers.location && redirects < 5) {
          resolve(probe(new URL(res.headers.location, target).toString(), redirects + 1));
          return;
        }
        resolve({ status });
      },
    );
    req.on('timeout', () => {
      req.destroy(new Error('timeout after 20s'));
    });
    req.on('error', (error) => resolve({ status: null, error: error.message }));
    req.end();
  });
}

test.describe('external links @external', () => {
  test.skip(!process.env['CHECK_EXTERNAL_LINKS'], 'set CHECK_EXTERNAL_LINKS=1 to run the external link check');
  test.setTimeout(10 * 60 * 1000);

  test('every outbound link answers with a non-error status', async ({ home }, testInfo) => {
    const urls = [...new Set((await home.allLinks()).map((l) => l.href).filter((h) => /^https?:\/\//.test(h)))];
    const broken: string[] = [];
    const blocked: string[] = [];
    for (const url of urls) {
      const result = await probe(url);
      if (result.status === null) broken.push(`${result.error ?? 'no response'} ${url}`);
      else if (BLOCKED_STATUSES.has(result.status)) blocked.push(`${result.status} ${url}`);
      else if (result.status >= 400) broken.push(`${result.status} ${url}`);
    }
    console.log(`checked ${urls.length} external links: ${broken.length} broken, ${blocked.length} blocked bots`);
    if (blocked.length > 0) {
      console.log(`blocked for automated clients (open by hand):\n${blocked.join('\n')}`);
      testInfo.annotations.push({ type: 'blocked-for-bots', description: blocked.join(', ') });
    }
    expect(broken, broken.join('\n')).toEqual([]);
  });
});
