import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { n as newId } from './ids-CipgF91a.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'crypto';
import 'proper-lockfile';

const ASSETS_DIR = process.env.ASSETS_DIR ?? join(process.cwd(), "data");
async function fetchItemAssets(labId, itemId) {
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === itemId);
  if (!item) return { fetched: 0, skipped: 0, errors: [`Item ${itemId} not found`] };
  const targets = [];
  if (item.datasheet_url) targets.push({ url: item.datasheet_url, kind: "datasheet" });
  for (const url of item.tutorial_links ?? []) targets.push({ url, kind: "tutorial" });
  if (targets.length === 0) return { fetched: 0, skipped: 0, errors: [] };
  const assetDir = join(ASSETS_DIR, labId, "assets", itemId);
  mkdirSync(assetDir, { recursive: true });
  let fetched = 0;
  let skipped = 0;
  const errors = [];
  await withLocks(labId, ["media_assets.json"], async () => {
    const existing = readDb(labId, "media_assets.json");
    for (const target of targets) {
      const alreadyDone = existing.find(
        (a) => a.item_id === itemId && a.url === target.url && a.local_path && !a.fetch_error
      );
      if (alreadyDone) {
        skipped++;
        continue;
      }
      const record = {
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
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15e3);
        const res = await fetch(target.url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type") ?? "application/octet-stream";
        if (contentType.includes("text/html") || contentType.includes("text/javascript")) {
          throw new Error(`Refused MIME type: ${contentType}`);
        }
        const buf = Buffer.from(await res.arrayBuffer());
        const ext = extname(new URL(target.url).pathname) || ".bin";
        const filename = `${record.id}${ext}`;
        const localPath = join(assetDir, filename);
        writeFileSync(localPath, buf);
        record.local_path = join(labId, "assets", itemId, filename);
        record.mime_type = contentType.split(";")[0].trim();
        record.file_size = buf.byteLength;
        record.fetched_at = (/* @__PURE__ */ new Date()).toISOString();
        fetched++;
      } catch (e) {
        record.fetch_error = e instanceof Error ? e.message : String(e);
        errors.push(`${target.url}: ${record.fetch_error}`);
      }
      existing.push(record);
    }
    await commit({
      labId,
      writes: [["media_assets.json", existing]],
      audit: {
        actor_id: "system",
        actor_role: "system",
        action: "assets.fetch",
        entity_type: "item",
        entity_id: itemId,
        after: { fetched, skipped, errors: errors.length }
      }
    });
  });
  return { fetched, skipped, errors };
}
const POST = withAuth(async (ctx) => {
  const { labId, id } = ctx.params;
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  const result = await fetchItemAssets(labId, id);
  return ok(result);
}, { minRole: "manager" });

export { POST };
//# sourceMappingURL=_server.ts-DPgbays1.js.map
