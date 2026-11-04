import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { testStatusSchema, type TestStatus } from './test-status.schema.ts';

const STATUS_FILE = fileURLToPath(new URL('../../public/test-status.json', import.meta.url));

/**
 * The CI summary for the commit being built, or `null` when none was written
 * (local builds, pull-request builds). A malformed file is treated as absent
 * and logged, so the panel degrades instead of the build failing.
 */
export function getTestStatus(): TestStatus | null {
  if (!existsSync(STATUS_FILE)) return null;
  try {
    const parsed = testStatusSchema.safeParse(JSON.parse(readFileSync(STATUS_FILE, 'utf8')));
    if (parsed.success) return parsed.data;
    console.warn('[status] public/test-status.json is invalid; showing the pending state.', parsed.error.issues);
    return null;
  } catch (error) {
    console.warn('[status] public/test-status.json could not be read; showing the pending state.', error);
    return null;
  }
}
