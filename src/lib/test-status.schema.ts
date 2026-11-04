import { z } from 'zod';

/**
 * Summary of the CI run that produced a deployment. Written by
 * `scripts/write-test-status.ts` to `public/test-status.json` before the
 * production build, and read by `src/lib/status.ts` at build time.
 */
export const testStatusSchema = z.object({
  schemaVersion: z.literal(1),
  commit: z.string().regex(/^[0-9a-f]{40}$/),
  runId: z.string().min(1),
  runUrl: z.url(),
  date: z.iso.datetime(),
  tests: z.object({
    passed: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    skipped: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }),
  browsers: z.array(z.string().min(1)).min(1),
  a11y: z.object({
    status: z.enum(['pass', 'fail']),
    /** Serious or critical axe violations found across all pages and themes. */
    violations: z.number().int().nonnegative(),
  }),
  lighthouse: z.object({
    performance: z.number().int().min(0).max(100),
    accessibility: z.number().int().min(0).max(100),
    bestPractices: z.number().int().min(0).max(100),
    seo: z.number().int().min(0).max(100),
  }),
});

export type TestStatus = z.infer<typeof testStatusSchema>;
