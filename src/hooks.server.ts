import 'dotenv/config';
import { bootMigrations } from '../migrations/runner.js';
import type { Handle } from '@sveltejs/kit';

// Kick off migrations immediately when this module loads.
// All requests await the same promise — zero duplicate runs.
const booted = bootMigrations();

export const handle: Handle = async ({ event, resolve }) => {
  await booted;
  return resolve(event);
};
