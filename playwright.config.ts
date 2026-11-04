import { defineConfig, devices } from '@playwright/test';

import { BASE } from './src/site.config';

const PORT = 4321;
const isCI = Boolean(process.env['CI']);

/** The production preview, served under the GitHub Pages base path. */
export const BASE_URL = `http://127.0.0.1:${PORT}${BASE}/`;

export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/report.json' }]],
  // Screenshot baselines are generated on Linux (Playwright's Docker image or CI).
  // A local run on another platform still executes the visual specs but does
  // not compare pixels, so Windows and macOS never need their own baselines.
  snapshotPathTemplate: '{testDir}/visual/__screenshots__/{testFileName}/{arg}-{projectName}{ext}',
  ignoreSnapshots: !isCI && process.platform !== 'linux',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    // CI builds explicitly before the suite; a local run builds on demand.
    command: isCI ? 'pnpm preview' : 'pnpm build && pnpm preview',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /tests[\\/]visual[\\/]/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: /tests[\\/]visual[\\/]/ },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: /tests[\\/]visual[\\/]/ },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testIgnore: /tests[\\/]visual[\\/]/ },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, testIgnore: /tests[\\/]visual[\\/]/ },
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
      testMatch: /tests[\\/]visual[\\/].*\.spec\.ts/,
    },
  ],
});
