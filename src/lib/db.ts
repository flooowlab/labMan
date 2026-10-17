import {
  readFileSync,
  writeFileSync,
  renameSync,
  statSync,
  appendFileSync,
  existsSync,
} from 'fs';
import { createHmac } from 'crypto';
import { join } from 'path';
import { lock } from 'proper-lockfile';
import type { AuditEntry } from './types.js';

export const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'src/data');

// ---------------------------------------------------------------------------
// In-memory read cache keyed by absolute path
// ---------------------------------------------------------------------------
const cache = new Map<string, { data: unknown[]; mtime: number }>();

export function readDb<T>(labId: string, file: string): T[] {
  const path = join(DATA_DIR, labId, file);
  if (!existsSync(path)) {
    throw new Error(`DB file not found: ${path}. Run migrations first.`);
  }
  const { mtimeMs } = statSync(path);
  const hit = cache.get(path);
  if (hit && hit.mtime === mtimeMs) return hit.data as T[];
  const data = JSON.parse(readFileSync(path, 'utf8')) as T[];
  cache.set(path, { data, mtime: mtimeMs });
  return data;
}

function writeDbSync<T>(labId: string, file: string, data: T[]): void {
  const path = join(DATA_DIR, labId, file);
  writeFileSync(path + '.tmp', JSON.stringify(data, null, 2), 'utf8');
  renameSync(path + '.tmp', path);
  cache.delete(path);
}

// ---------------------------------------------------------------------------
// Composite lock — always acquire in canonical alphabetical order
// ---------------------------------------------------------------------------
export async function withLocks<T>(
  labId: string,
  files: string[],
  fn: () => Promise<T>,
): Promise<T> {
  const sorted = [...new Set(files)].sort();
  const paths = sorted.map((f) => join(DATA_DIR, labId, f));
  const releases: Array<() => Promise<void>> = [];
  try {
    for (const p of paths) {
      releases.push(await lock(p, { retries: { retries: 8, minTimeout: 50 } }));
    }
    return await fn();
  } finally {
    for (const r of releases.reverse()) await r();
  }
}

// ---------------------------------------------------------------------------
// Audit log (append-only NDJSON, HMAC-chained)
// ---------------------------------------------------------------------------
function getAuditSecret(): string {
  const s = process.env.AUDIT_HMAC_SECRET ?? '';
  if (!s.trim()) throw new Error('AUDIT_HMAC_SECRET env var is not set. Add it to .env (min 32 chars).');
  return s;
}

function getLastAuditId(labId: string): string {
  const path = join(DATA_DIR, labId, 'audit_log.json');
  if (!existsSync(path)) return '';
  const content = readFileSync(path, 'utf8').trim();
  if (!content) return '';
  const lines = content.split('\n').filter((l) => l.trim());
  if (!lines.length) return '';
  try {
    return (JSON.parse(lines[lines.length - 1]) as AuditEntry).id;
  } catch {
    return '';
  }
}

export async function appendAudit(
  labId: string,
  entry: Omit<AuditEntry, 'id' | 'ts' | 'hmac' | 'lab_id'>,
): Promise<void> {
  const id = crypto.randomUUID();
  const ts = new Date().toISOString();
  const prevId = getLastAuditId(labId);
  const partial: Omit<AuditEntry, 'hmac'> = { id, ts, lab_id: labId, ...entry };
  const canonical = JSON.stringify(partial);
  const hmac = createHmac('sha256', getAuditSecret())
    .update(`${prevId}:${canonical}`)
    .digest('hex');
  const full: AuditEntry = { ...partial, hmac };
  const path = join(DATA_DIR, labId, 'audit_log.json');
  appendFileSync(path, JSON.stringify(full) + '\n', 'utf8');
}

export function readAuditLog(labId: string): AuditEntry[] {
  const path = join(DATA_DIR, labId, 'audit_log.json');
  if (!existsSync(path)) return [];
  const content = readFileSync(path, 'utf8').trim();
  if (!content) return [];
  return content
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as AuditEntry);
}

export function verifyAuditChain(entries: AuditEntry[]): boolean {
  let prevId = '';
  for (const entry of entries) {
    const { hmac, ...rest } = entry;
    const canonical = JSON.stringify(rest);
    const expected = createHmac('sha256', getAuditSecret())
      .update(`${prevId}:${canonical}`)
      .digest('hex');
    if (hmac !== expected) return false;
    prevId = entry.id;
  }
  return true;
}

// ---------------------------------------------------------------------------
// commit() — the ONLY path for persisting mutations
// All target files must be locked via withLocks() before calling commit().
// ---------------------------------------------------------------------------
export async function commit(opts: {
  labId: string;
  writes: Array<[string, unknown[]]>;
  audit: Omit<AuditEntry, 'id' | 'ts' | 'hmac' | 'lab_id'>;
}): Promise<void> {
  for (const [file, data] of opts.writes) {
    writeDbSync(opts.labId, file, data);
  }
  await appendAudit(opts.labId, opts.audit);
}
