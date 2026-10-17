import { existsSync, statSync, readFileSync, writeFileSync, renameSync, appendFileSync } from 'fs';
import { createHmac } from 'crypto';
import { join } from 'path';
import { lock } from 'proper-lockfile';

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), "src/data");
const cache = /* @__PURE__ */ new Map();
function readDb(labId, file) {
  const path = join(DATA_DIR, labId, file);
  if (!existsSync(path)) {
    throw new Error(`DB file not found: ${path}. Run migrations first.`);
  }
  const { mtimeMs } = statSync(path);
  const hit = cache.get(path);
  if (hit && hit.mtime === mtimeMs) return hit.data;
  const data = JSON.parse(readFileSync(path, "utf8"));
  cache.set(path, { data, mtime: mtimeMs });
  return data;
}
function writeDbSync(labId, file, data) {
  const path = join(DATA_DIR, labId, file);
  writeFileSync(path + ".tmp", JSON.stringify(data, null, 2), "utf8");
  renameSync(path + ".tmp", path);
  cache.delete(path);
}
async function withLocks(labId, files, fn) {
  const sorted = [...new Set(files)].sort();
  const paths = sorted.map((f) => join(DATA_DIR, labId, f));
  const releases = [];
  try {
    for (const p of paths) {
      releases.push(await lock(p, { retries: { retries: 8, minTimeout: 50 } }));
    }
    return await fn();
  } finally {
    for (const r of releases.reverse()) await r();
  }
}
function getAuditSecret() {
  const s = process.env.AUDIT_HMAC_SECRET ?? "";
  if (!s.trim()) throw new Error("AUDIT_HMAC_SECRET env var is not set. Add it to .env (min 32 chars).");
  return s;
}
function getLastAuditId(labId) {
  const path = join(DATA_DIR, labId, "audit_log.json");
  if (!existsSync(path)) return "";
  const content = readFileSync(path, "utf8").trim();
  if (!content) return "";
  const lines = content.split("\n").filter((l) => l.trim());
  if (!lines.length) return "";
  try {
    return JSON.parse(lines[lines.length - 1]).id;
  } catch {
    return "";
  }
}
async function appendAudit(labId, entry) {
  const id = crypto.randomUUID();
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  const prevId = getLastAuditId(labId);
  const partial = { id, ts, lab_id: labId, ...entry };
  const canonical = JSON.stringify(partial);
  const hmac = createHmac("sha256", getAuditSecret()).update(`${prevId}:${canonical}`).digest("hex");
  const full = { ...partial, hmac };
  const path = join(DATA_DIR, labId, "audit_log.json");
  appendFileSync(path, JSON.stringify(full) + "\n", "utf8");
}
function readAuditLog(labId) {
  const path = join(DATA_DIR, labId, "audit_log.json");
  if (!existsSync(path)) return [];
  const content = readFileSync(path, "utf8").trim();
  if (!content) return [];
  return content.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
}
function verifyAuditChain(entries) {
  let prevId = "";
  for (const entry of entries) {
    const { hmac, ...rest } = entry;
    const canonical = JSON.stringify(rest);
    const expected = createHmac("sha256", getAuditSecret()).update(`${prevId}:${canonical}`).digest("hex");
    if (hmac !== expected) return false;
    prevId = entry.id;
  }
  return true;
}
async function commit(opts) {
  for (const [file, data] of opts.writes) {
    writeDbSync(opts.labId, file, data);
  }
  await appendAudit(opts.labId, opts.audit);
}

export { DATA_DIR as D, readDb as a, commit as c, readAuditLog as r, verifyAuditChain as v, withLocks as w };
//# sourceMappingURL=db-CfhGAyvN.js.map
