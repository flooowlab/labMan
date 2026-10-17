import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR } from '../src/lib/db.js';

// ---------------------------------------------------------------------------
// Files created for every new lab (empty arrays)
// ---------------------------------------------------------------------------
const LAB_ARRAY_FILES = [
  'items.json',
  'units.json',
  'item_accessories.json',
  'kits.json',
  'borrows.json',
  'borrow_extensions.json',
  'incident_reports.json',
  'reservations.json',
  'owners.json',
  'locations.json',
  'availability_rules.json',
  'authorizations.json',
  'alerts.json',
  'media_assets.json',
  'location_diagram.json',
] as const;

export async function up(labId: string): Promise<void> {
  const dir = join(DATA_DIR, labId);
  mkdirSync(dir, { recursive: true });

  for (const file of LAB_ARRAY_FILES) {
    const path = join(dir, file);
    if (!existsSync(path)) writeFileSync(path, '[]', 'utf8');
  }

  const auditPath = join(dir, 'audit_log.json');
  if (!existsSync(auditPath)) writeFileSync(auditPath, '', 'utf8');
}
