import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { D as DATA_DIR, a as readDb } from './db-CfhGAyvN.js';

const LAB_ARRAY_FILES = [
  "items.json",
  "units.json",
  "item_accessories.json",
  "kits.json",
  "borrows.json",
  "borrow_extensions.json",
  "incident_reports.json",
  "reservations.json",
  "owners.json",
  "locations.json",
  "availability_rules.json",
  "authorizations.json",
  "alerts.json",
  "media_assets.json",
  "location_diagram.json"
];
async function up(labId) {
  const dir = join(DATA_DIR, labId);
  mkdirSync(dir, { recursive: true });
  for (const file of LAB_ARRAY_FILES) {
    const path = join(dir, file);
    if (!existsSync(path)) writeFileSync(path, "[]", "utf8");
  }
  const auditPath = join(dir, "audit_log.json");
  if (!existsSync(auditPath)) writeFileSync(auditPath, "", "utf8");
}
const MIGRATIONS = [
  { version: 1, up }
];
const DEFAULT_CONFIG = (labId) => ({
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
  low_stock_check_cron: "0 8 * * *",
  require_return_signature: true
});
async function runMigrations(labId) {
  const dir = join(DATA_DIR, labId);
  mkdirSync(dir, { recursive: true });
  const configPath = join(dir, "config.json");
  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify([DEFAULT_CONFIG(labId)], null, 2), "utf8");
  }
  const configs = readDb(labId, "config.json");
  const config = configs[0];
  const current = config.schema_version ?? 0;
  for (const m of MIGRATIONS.filter((x) => x.version > current)) {
    console.log(`[migration] lab=${labId} applying v${m.version}`);
    await m.up(labId);
    config.schema_version = m.version;
    writeFileSync(configPath, JSON.stringify([config], null, 2), "utf8");
    console.log(`[migration] lab=${labId} v${m.version} done`);
  }
}
let _bootPromise = null;
function bootMigrations() {
  if (_bootPromise) return _bootPromise;
  _bootPromise = (async () => {
    const globalDir = join(DATA_DIR, "_global");
    mkdirSync(globalDir, { recursive: true });
    const globalFiles = ["labs.json", "users.json", "lab_memberships.json"];
    for (const f of globalFiles) {
      const p = join(globalDir, f);
      if (!existsSync(p)) writeFileSync(p, "[]", "utf8");
    }
    const auditPath = join(globalDir, "audit_log.json");
    if (!existsSync(auditPath)) writeFileSync(auditPath, "", "utf8");
    let labs = [];
    try {
      labs = readDb("_global", "labs.json");
    } catch {
    }
    for (const lab of labs.filter((l) => l.is_active)) {
      await runMigrations(lab.id);
    }
  })();
  return _bootPromise;
}

export { bootMigrations as b, runMigrations as r };
//# sourceMappingURL=runner-DQcmKiSu.js.map
