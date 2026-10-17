/**
 * scripts/fetch-assets.ts
 * Fetch and store assets (datasheets, tutorial links) for all items in a lab.
 * Usage: npx tsx scripts/fetch-assets.ts <lab-id>
 */
import { config } from 'dotenv';
import { readDb } from '../src/lib/db.js';
import { fetchItemAssets } from '../src/lib/assets.js';
import type { Item } from '../src/lib/types.js';

config();

const labId = process.argv[2];
if (!labId) {
  console.error('Usage: npx tsx scripts/fetch-assets.ts <lab-id>');
  process.exit(1);
}

async function main() {
  console.log(`[fetch-assets] starting for lab ${labId}`);
  const items = readDb<Item>(labId, 'items.json').filter((i) => !i.deleted_at);
  const withUrls = items.filter((i) => i.datasheet_url || i.tutorial_links?.length);
  console.log(`[fetch-assets] ${withUrls.length} items have asset URLs`);

  let totalFetched = 0;
  let totalErrors = 0;

  for (const item of withUrls) {
    const result = await fetchItemAssets(labId, item.id);
    totalFetched += result.fetched;
    totalErrors += result.errors.length;
    if (result.errors.length) {
      result.errors.forEach((e) => console.warn(`  [warn] ${item.name}: ${e}`));
    } else if (result.fetched > 0) {
      console.log(`  [ok] ${item.name}: fetched ${result.fetched}`);
    }
  }

  console.log(`[fetch-assets] done — fetched: ${totalFetched}, errors: ${totalErrors}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
