/**
 * Summarise the CI run into public/test-status.json for the production build.
 *
 * Inputs (all produced earlier in the same workflow run, for the same commit):
 *   test-results/report.json        Playwright JSON reporter
 *   .lighthouseci-out/manifest.json Lighthouse CI filesystem upload
 *   GITHUB_SHA, GITHUB_RUN_ID, GITHUB_SERVER_URL, GITHUB_REPOSITORY
 *
 * Usage: node scripts/write-test-status.ts [outputPath]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { testStatusSchema, type TestStatus } from '../src/lib/test-status.schema.ts';

interface PlaywrightSuite {
  title: string;
  file?: string;
  suites?: PlaywrightSuite[];
  specs?: PlaywrightSpec[];
}

interface PlaywrightSpec {
  title: string;
  file: string;
  tests: {
    projectName: string;
    status: 'expected' | 'unexpected' | 'flaky' | 'skipped';
    annotations?: { type: string; description?: string }[];
  }[];
}

interface PlaywrightReport {
  config: { projects: { name: string }[] };
  suites: PlaywrightSuite[];
  stats: { expected: number; unexpected: number; flaky: number; skipped: number };
}

interface LighthouseManifestEntry {
  url: string;
  isRepresentativeRun: boolean;
  summary: { performance: number; accessibility: number; 'best-practices': number; seo: number };
}

const browserNames: Record<string, string> = {
  chromium: 'Chromium',
  firefox: 'Firefox',
  webkit: 'WebKit',
  'mobile-chrome': 'Mobile Chrome',
  'mobile-safari': 'Mobile Safari',
};

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set; this script runs inside GitHub Actions`);
  return value;
}

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

function* walkSpecs(suites: PlaywrightSuite[]): Generator<PlaywrightSpec> {
  for (const suite of suites) {
    for (const spec of suite.specs ?? []) yield spec;
    if (suite.suites) yield* walkSpecs(suite.suites);
  }
}

const report = readJson<PlaywrightReport>('test-results/report.json');
const manifest = readJson<LighthouseManifestEntry[]>('.lighthouseci-out/manifest.json');

let axeTests = 0;
let axeFailures = 0;
let axeViolations = 0;
for (const spec of walkSpecs(report.suites)) {
  if (!/a11y[\\/]axe\.spec\.ts$/.test(spec.file)) continue;
  for (const run of spec.tests) {
    if (run.status === 'skipped') continue;
    axeTests += 1;
    if (run.status === 'unexpected') axeFailures += 1;
    const annotation = run.annotations?.find((a) => a.type === 'axe-violations');
    axeViolations += Number(annotation?.description ?? 0);
  }
}
if (axeTests === 0) throw new Error('no axe results found in the Playwright report');

const representative = manifest.find((m) => m.isRepresentativeRun && /\/portfolio\/$/.test(m.url)) ?? manifest[0];
if (!representative) throw new Error('no Lighthouse results found');
const score = (value: number): number => Math.round(value * 100);

const browsers = report.config.projects
  .map((p) => p.name)
  .filter((name) => name !== 'visual')
  .map((name) => browserNames[name] ?? name);

const status: TestStatus = {
  schemaVersion: 1,
  commit: env('GITHUB_SHA'),
  runId: env('GITHUB_RUN_ID'),
  runUrl: `${env('GITHUB_SERVER_URL')}/${env('GITHUB_REPOSITORY')}/actions/runs/${env('GITHUB_RUN_ID')}`,
  date: new Date().toISOString(),
  tests: {
    passed: report.stats.expected + report.stats.flaky,
    failed: report.stats.unexpected,
    skipped: report.stats.skipped,
    total: report.stats.expected + report.stats.flaky + report.stats.unexpected + report.stats.skipped,
  },
  browsers,
  a11y: { status: axeFailures === 0 && axeViolations === 0 ? 'pass' : 'fail', violations: axeViolations },
  lighthouse: {
    performance: score(representative.summary.performance),
    accessibility: score(representative.summary.accessibility),
    bestPractices: score(representative.summary['best-practices']),
    seo: score(representative.summary.seo),
  },
};

const parsed = testStatusSchema.parse(status);
const output = process.argv[2] ?? 'public/test-status.json';
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(parsed, null, 2)}\n`);
console.log(`wrote ${output}`);
console.log(JSON.stringify(parsed, null, 2));
