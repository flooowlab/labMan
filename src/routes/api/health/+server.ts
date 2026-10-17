import { readDb } from '$lib/db.js';
import type { Lab } from '$lib/types.js';

export const GET = async () => {
  let labCount = 0;
  try {
    labCount = readDb<Lab>('_global', 'labs.json').filter((l) => l.is_active).length;
  } catch {
    // data dir not ready yet
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      labs: labCount,
      uptime_s: Math.floor(process.uptime()),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
