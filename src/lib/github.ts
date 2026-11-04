/**
 * Build-time GitHub metadata for a repository. Optional: any failure (offline,
 * rate limit, bad token, timeout) returns `null` and the static data file is
 * all the page shows. The build never fails because of this module.
 */
export interface RepoMeta {
  language: string | null;
  topics: string[];
  pushedAt: string;
}

const cache = new Map<string, Promise<RepoMeta | null>>();

export function fetchRepoMeta(repo: string): Promise<RepoMeta | null> {
  if (process.env['PORTFOLIO_SKIP_GITHUB'] === '1') return Promise.resolve(null);
  const cached = cache.get(repo);
  if (cached) return cached;
  const pending = load(repo);
  cache.set(repo, pending);
  return pending;
}

async function load(repo: string): Promise<RepoMeta | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'jumilandelapena-portfolio-build',
    };
    const token = process.env['GITHUB_TOKEN'];
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: controller.signal,
    });
    if (!response.ok) {
      console.warn(`[github] ${repo}: ${response.status} ${response.statusText}; using static data only.`);
      return null;
    }
    const body: unknown = await response.json();
    if (!isRepoResponse(body)) return null;
    return {
      language: body.language ?? null,
      topics: Array.isArray(body.topics) ? body.topics.filter((t): t is string => typeof t === 'string') : [],
      pushedAt: body.pushed_at,
    };
  } catch (error) {
    console.warn(
      `[github] ${repo}: ${error instanceof Error ? error.message : String(error)}; using static data only.`,
    );
    return null;
  } finally {
    clearTimeout(timer);
  }
}

interface RepoResponse {
  language?: string | null;
  topics?: unknown;
  pushed_at: string;
}

function isRepoResponse(value: unknown): value is RepoResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'pushed_at' in value &&
    typeof (value as { pushed_at: unknown }).pushed_at === 'string'
  );
}
