/**
 * src/lib/assets.ts
 * Asset fetching helpers — download photos/datasheets from URLs to disk.
 * Binary files go to ASSETS_DIR/{lab-id}/assets/{item-id}/ (not DATA_DIR).
 * Input:  labId, itemId, urls with kind labels
 * Output: updated media_assets.json entries
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { readDb, withLocks, commit } from './db.js';
import { newId } from './ids.js';
import type { Item, MediaAsset } from './types.js';

export const ASSETS_DIR = process.env.ASSETS_DIR ?? join(process.cwd(), 'data');

type FetchTarget = { url: string; kind: MediaAsset['kind'] };

/**
 * Fetch all pending assets for a single item.
 * Returns { fetched, skipped, errors }.
 */
export async function fetchItemAssets(
  labId: string,
  itemId: string,
): Promise<{ fetched: number; skipped: number; errors: string[] }> {
  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === itemId);
  if (!item) return { fetched: 0, skipped: 0, errors: [`Item ${itemId} not found`] };

  const targets: FetchTarget[] = [];
  if (item.datasheet_url) targets.push({ url: item.datasheet_url, kind: 'datasheet' });
  for (const url of item.tutorial_links ?? []) targets.push({ url, kind: 'tutorial' });

  if (targets.length === 0) return { fetched: 0, skipped: 0, errors: [] };

  const assetDir = join(ASSETS_DIR, labId, 'assets', itemId);
  mkdirSync(assetDir, { recursive: true });

  let fetched = 0;
  let skipped = 0;
  const errors: string[] = [];

  await withLocks(labId, ['media_assets.json'], async () => {
    const existing = readDb<MediaAsset>(labId, 'media_assets.json');

    for (const target of targets) {
      const alreadyDone = existing.find(
        (a) => a.item_id === itemId && a.url === target.url && a.local_path && !a.fetch_error,
      );
      if (alreadyDone) { skipped++; continue; }

      const record: MediaAsset = {
        id: newId(),
        lab_id: labId,
        item_id: itemId,
        kind: target.kind,
        url: target.url,
        local_path: null,
        mime_type: null,
        file_size: null,
        fetched_at: null,
        fetch_error: null,
        created_at: new Date().toISOString(),
      };

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15_000);
        const res = await fetch(target.url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
        // Only allow safe MIME types — no HTML
        if (contentType.includes('text/html') || contentType.includes('text/javascript')) {
          throw new Error(`Refused MIME type: ${contentType}`);
        }

        const buf = Buffer.from(await res.arrayBuffer());
        const ext = extname(new URL(target.url).pathname) || '.bin';
        const filename = `${record.id}${ext}`;
        const localPath = join(assetDir, filename);
        writeFileSync(localPath, buf);

        record.local_path = join(labId, 'assets', itemId, filename);
        record.mime_type = contentType.split(';')[0]!.trim();
        record.file_size = buf.byteLength;
        record.fetched_at = new Date().toISOString();
        fetched++;
      } catch (e: unknown) {
        record.fetch_error = e instanceof Error ? e.message : String(e);
        errors.push(`${target.url}: ${record.fetch_error}`);
      }

      existing.push(record);
    }

    await commit({
      labId,
      writes: [['media_assets.json', existing]],
      audit: {
        actor_id: 'system',
        actor_role: 'system',
        action: 'assets.fetch',
        entity_type: 'item',
        entity_id: itemId,
        after: { fetched, skipped, errors: errors.length },
      },
    });
  });

  return { fetched, skipped, errors };
}
