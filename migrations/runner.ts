import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR, readDb } from '../src/lib/db.js';
import type { Config, Lab } from '../src/lib/types.js';
import { up as migration0001 } from './0001-initial-schema.js';

// ---------------------------------------------------------------------------
// Migration registry — append only, never edit existing entries
// ---------------------------------------------------------------------------
const MIGRATIONS: Array<{ version: number; up: (labId: string) => Promise<void> }> = [
  { version: 1, up: migration0001 },
];

const DEFAULT_CONFIG = (labId: string): Config => ({
  lab_id: labId,
  schema_version: 0,
  pending_ttl_hours: 72,
  no_show_grace_minutes: 30,
  no_show_restriction_threshold: 3,
  no_show_restriction_days: 14,
  max_advance_booking_days: 60,
  min_lead_time_minutes_student: 60,
  min_lead_time_minutes_staff: 0,
  default_max_borrow_days: 7,
  penalty_warning_days_overdue: 1,
  penalty_suspension_days_overdue: 2,
  penalty_suspension_duration_days: 14,
  low_stock_check_cron: '0 8 * * *',
  require_return_signature: true,
});

// ---------------------------------------------------------------------------
// Run pending migrations for a single lab
// ---------------------------------------------------------------------------
export async function runMigrations(labId: string): Promise<void> {
  const dir = join(DATA_DIR, labId);
  mkdirSync(dir, { recursive: true });

  const configPath = join(dir, 'config.json');
  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify([DEFAULT_CONFIG(labId)], null, 2), 'utf8');
  }

  const configs = readDb<Config>(labId, 'config.json');
  const config = configs[0];
  const current = config.schema_version ?? 0;

  for (const m of MIGRATIONS.filter((x) => x.version > current)) {
    console.log(`[migration] lab=${labId} applying v${m.version}`);
    await m.up(labId);
    config.schema_version = m.version;
    // Direct write here — audit infrastructure may not be ready yet
    writeFileSync(configPath, JSON.stringify([config], null, 2), 'utf8');
    console.log(`[migration] lab=${labId} v${m.version} done`);
  }
}

// ---------------------------------------------------------------------------
// Boot-time runner: migrate all active labs
// ---------------------------------------------------------------------------
let _bootPromise: Promise<void> | null = null;

export function bootMigrations(): Promise<void> {
  if (_bootPromise) return _bootPromise;
  _bootPromise = (async () => {
    // Ensure _global directory and files exist
    const globalDir = join(DATA_DIR, '_global');
    mkdirSync(globalDir, { recursive: true });
    const globalFiles = ['labs.json', 'users.json', 'lab_memberships.json'];
    for (const f of globalFiles) {
      const p = join(globalDir, f);
      if (!existsSync(p)) writeFileSync(p, '[]', 'utf8');
    }
    const auditPath = join(globalDir, 'audit_log.json');
    if (!existsSync(auditPath)) writeFileSync(auditPath, '', 'utf8');

    // Run migrations for every active lab
    let labs: Lab[] = [];
    try {
      labs = readDb<Lab>('_global', 'labs.json');
    } catch {
      // No labs yet — that's fine on first boot
    }
    for (const lab of labs.filter((l) => l.is_active)) {
      await runMigrations(lab.id);
    }
  })();
  return _bootPromise;
}
