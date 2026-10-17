/**
 * scripts/seed.ts
 * Run once to bootstrap the first super-admin user and first lab.
 * Usage: npx tsx scripts/seed.ts
 */
import { createInterface } from 'readline';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config(); // load .env

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'src/data');

// ---------------------------------------------------------------------------
// Readline helpers
// ---------------------------------------------------------------------------
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> =>
  new Promise((res) => rl.question(q, res));

function readJson<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T[];
  } catch {
    return [];
  }
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('\n=== Lab Manager — Seed Script ===\n');

  // Collect inputs
  const adminName = (await ask('Super-admin name: ')).trim();
  const adminEmail = (await ask('Super-admin email: ')).trim().toLowerCase();
  const adminPassword = (await ask('Super-admin password (min 8 chars): ')).trim();
  const labName = (await ask('First lab name: ')).trim();
  const labSlug = (await ask('First lab slug (e.g. media-arts): ')).trim().toLowerCase();
  const labRoom = (await ask('Lab room (optional, press Enter to skip): ')).trim();
  rl.close();

  if (adminPassword.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }
  if (!/^[a-z0-9-]+$/.test(labSlug)) {
    console.error('Lab slug must be lowercase alphanumeric with hyphens.');
    process.exit(1);
  }

  // Bootstrap global dir
  const globalDir = join(DATA_DIR, '_global');
  ensureDir(globalDir);

  const usersPath = join(globalDir, 'users.json');
  const labsPath = join(globalDir, 'labs.json');
  const membershipsPath = join(globalDir, 'lab_memberships.json');
  const auditPath = join(globalDir, 'audit_log.json');

  const users = readJson<Record<string, unknown>>(usersPath);
  const labs = readJson<Record<string, unknown>>(labsPath);

  // Guard: do not create duplicate super-admin
  if (users.some((u) => u['email'] === adminEmail)) {
    console.error(`User with email ${adminEmail} already exists. Aborting.`);
    process.exit(1);
  }
  if (labs.some((l) => l['slug'] === labSlug)) {
    console.error(`Lab with slug "${labSlug}" already exists. Aborting.`);
    process.exit(1);
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const labId = crypto.randomUUID();
  const membershipId = crypto.randomUUID();

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Create user
  const user = {
    id: userId,
    rfid_tag: null,
    name: adminName,
    email: adminEmail,
    password_hash: passwordHash,
    must_change_password: false,
    totp_secret_enc: null,
    totp_enabled: false,
    is_active: true,
    created_at: now,
    updated_at: now,
    redacted_at: null,
  };

  // Create lab
  const lab = {
    id: labId,
    slug: labSlug,
    name: labName,
    room: labRoom || '',
    contact_email: adminEmail,
    is_active: true,
    created_at: now,
  };

  // Create super-admin global membership (lab_id: '_global')
  const membership = {
    id: membershipId,
    user_id: userId,
    lab_id: '_global',
    role: 'admin',
    user_type: 'staff',
    student_level: 0,
    instructor_ids: [],
    no_show_count: 0,
    borrow_restricted_until: null,
    is_active: true,
    created_at: now,
  };

  // Persist global records
  writeJson(usersPath, [...users, user]);
  writeJson(labsPath, [...labs, lab]);
  const memberships = readJson<Record<string, unknown>>(membershipsPath);
  writeJson(membershipsPath, [...memberships, membership]);
  if (!existsSync(auditPath)) writeFileSync(auditPath, '', 'utf8');

  // Bootstrap lab data dir
  const labDir = join(DATA_DIR, labId);
  ensureDir(labDir);

  const labFiles = [
    'items.json', 'units.json', 'item_accessories.json', 'kits.json',
    'borrows.json', 'borrow_extensions.json', 'incident_reports.json',
    'reservations.json', 'owners.json', 'locations.json',
    'availability_rules.json', 'authorizations.json', 'alerts.json',
    'media_assets.json', 'location_diagram.json',
  ];
  for (const f of labFiles) {
    const p = join(labDir, f);
    if (!existsSync(p)) writeFileSync(p, '[]', 'utf8');
  }
  const labAudit = join(labDir, 'audit_log.json');
  if (!existsSync(labAudit)) writeFileSync(labAudit, '', 'utf8');

  // Config for the new lab (schema_version: 1 — already bootstrapped)
  const labConfig = {
    lab_id: labId,
    schema_version: 1,
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
  };
  writeJson(join(labDir, 'config.json'), [labConfig]);

  // Also create a lab-scoped admin membership
  const labMembershipId = crypto.randomUUID();
  const labMembership = {
    id: labMembershipId,
    user_id: userId,
    lab_id: labId,
    role: 'admin',
    user_type: 'staff',
    student_level: 0,
    instructor_ids: [],
    no_show_count: 0,
    borrow_restricted_until: null,
    is_active: true,
    created_at: now,
  };
  writeJson(membershipsPath, [
    ...readJson<Record<string, unknown>>(membershipsPath),
    labMembership,
  ]);

  console.log('\n✓ Seed complete');
  console.log(`  User ID   : ${userId}`);
  console.log(`  Lab ID    : ${labId}`);
  console.log(`  Lab slug  : ${labSlug}`);
  console.log('\nNext steps:');
  console.log('  1. Copy .env.example to .env and fill in secrets');
  console.log('  2. npm run dev');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
