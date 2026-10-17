# CLAUDE.md — Lab Management System
## Production Development Guide

This file is the authoritative reference for building the lab management system. Read it entirely before writing any code. Update it when architectural decisions change. Every open question in the design review has been resolved below — do not re-open them without a written decision from the lab director.

---

## Resolved design decisions (record of answers)

| # | Topic | Decision |
|---|---|---|
| 1 | Audit log | Adopt — append-only `audit_log.json`, HMAC-chained, every mutation carries an entry |
| 2 | Performance / security | Rate-limit login, add CSP, in-memory readDb cache, composite locks in canonical order |
| 3 | No-show loop | Adopt — cron, `no_show_count`, warning then suspension (`borrow_restricted_until`) |
| 4 | Incident reports | Adopt — `incident_reports.json`, photo attachments, per-line at return |
| 5 | Schema migrations | Adopt — `migrations/` folder, `schema_version` in `config.json`, boot-time runner |
| 6 | Notifications | Adopt — email (nodemailer) minimum; Web Push optional |
| 7 | Request logging | Adopt — `pino` + `pino-http`, correlation ID on every request and audit entry |
| 8 | Healthcheck | Adopt — `GET /api/health` |
| 9 | CSV/JSON export | Adopt — `GET /api/users/:id/export`, `redacted_at` for PII |
| 10 | Loan extensions | Allow — `POST /api/borrows/:id/request-extension`, manager approval, cumulative cap |
| 11 | Cancelled borrows | Record stays with full history; disappears from active views via status filter. Early returns recorded immediately, quantity restored per returned amount |
| 12 | Maintenance schedule | Secondary — manual status flip for now; periodic-service cron deferred to Phase 9 |
| 13 | Bulk import + label sheet | Adopt — `POST /api/items/bulk-import` CSV, "print all unlabelled units" sheet |
| 14 | Kits | Adopt — first-class `kits.json` with versioned bundle |
| 15 | Client-side search | Adopt — `lunr.js`, rebuilt on item add, cached in PWA service worker |
| 16 | TOTP 2FA | Adopt — optional enroll, required for `admin` when `LAB_REQUIRE_2FA_ADMIN=true` |
| 17 | Public catalog | Adopt — `/catalog` read-only, no auth, no PII |
| 18 | Service worker scope | Cache static + catalog GETs only; bypass cache for borrows/reservations/users |
| 19 | Multi-lab | Yes — every entity carries `lab_id`; queries filter by tenant; JWT carries memberships |
| 20 | Instructor reservation visibility | Approver-named only (not whole department) |
| 21 | Late return penalty | Warning on first offence (>= 1 day overdue); suspension from second (>= 2 days overdue) |
| 22 | Self-service return | No — technician presence + `return_sig_data` required on every return |
| 23 | Data retention | Never delete records; redact PII fields 18 months post-final-state |

---

## Project overview

A web-first, mobile-responsive, **multi-lab** inventory and borrowing system. Single deployable monolith per installation. JSON file storage. No external database required. Runs on a Node.js server behind Caddy.

**Core capabilities:**
- Multi-lab tenancy: each lab is an isolated tenant; a single server hosts all labs; users may belong to multiple labs with different roles in each
- Two-tier inventory model: **items** (catalog/SKU entries) and **units** (individual physical instances of serialized items)
- Barcode/QR generation per unit (serialized) or per item (bulk), with label printing
- First-class **kits** (named, versioned bundles of item lines with their own availability rules)
- Item accessories (required + optional), ownership, and location tracking
- User management with RBAC (`admin | manager | technician | instructor | student | viewer`) per lab
- Instructor-gated borrowing for restricted item categories
- Borrow transactions with line items, electronic signatures, and printable documents
- **Loan extensions** with manager approval and cumulative-days cap
- **Reservation system** with FullCalendar resource-timeline UI, conflict checking, and an instructor-pre-approval → manager-approval workflow
- Penalty escalation: warning on first overdue offence, suspension on second
- Incident reports with photo attachments, captured per line at return time
- Background asset fetching (photos, datasheets, tutorials) from manufacturer sites
- Interactive lab floor-plan diagram per lab
- Schema migration runner at boot
- Audit log (append-only, HMAC-chained)
- Structured request logging with correlation IDs
- Public read-only catalog — no auth, no PII
- CSV/JSON user-data export; PII redaction at 18 months
- Bulk CSV import + label-sheet generation for onboarding
- Client-side full-text search via `lunr.js`, offline-capable via PWA
- 2FA (TOTP) optional per user, required for `admin` when configured

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Meta-framework | Astro 4 (SSR, Node adapter) | File-based routing, API routes, React islands |
| UI components | React 18 (islands only) | Interactivity where needed; static elsewhere |
| Design system | Carbon Design System (CDN build) | Accessible, responsive, enterprise-grade |
| Auth | JWT in `httpOnly` cookies | No session store; stateless; carries `lab_id` + memberships |
| 2FA | `speakeasy` + `qrcode` | TOTP enroll flow; required for admin when configured |
| Storage | JSON files + `proper-lockfile` | Human-readable, Git-trackable, zero infra |
| Barcode gen | `bwip-js` (server-side) | Pure Node, no canvas dependency |
| QR gen | `qrcode` | Outputs SVG or PNG |
| Scanning | `@zxing/browser` (client-side) | Camera access via `getUserMedia` |
| NFC | Web NFC API + manual fallback | Android Chrome only; fallback for iOS/desktop |
| Signatures | `signature_pad` (client-side) | MIT license, canvas-based, touch-friendly |
| Print layout | `paged.js` + `jsPDF` | Paginated HTML print + PDF export |
| Asset fetch | `node-cron` + `puppeteer` (optional) | Nightly background job; puppeteer only for JS-heavy sites |
| Calendar | `@fullcalendar/core` + `@fullcalendar/resource-timeline` | Accessible reservation UI |
| Client search | `lunr.js` | Offline-capable, no server round-trip |
| Validation | `zod` | Runtime schema validation on all API inputs |
| Password hash | `bcrypt` | For PIN/password storage |
| Notifications | `nodemailer` + Web Push (optional) | Email approval workflow + overdue alerts |
| Logging | `pino` + `pino-http` | Structured JSON logs with correlation IDs |
| Tests | `vitest` + `supertest` | Unit + API integration |
| Reverse proxy | Caddy | Auto-HTTPS, simple config, CSP header |
| Rate limiting | In-process token bucket | Per-IP, per-minute; adequate for single-process pm2 |

---

## Repository structure

```
lab-manager/
├── CLAUDE.md
├── astro.config.mjs
├── package.json
├── caddy/Caddyfile
├── migrations/
│   ├── runner.ts              ← boot-time migration runner
│   └── 0001-initial-schema.ts
├── scripts/
│   ├── fetch-assets.ts
│   ├── check-overdue.ts
│   ├── seed.ts                ← create first admin + lab
│   └── bulk-import.ts
├── src/
│   ├── pages/
│   │   ├── index.astro                    ← lab selector (multi-lab landing)
│   │   ├── [lab]/                         ← all pages scoped to a lab slug
│   │   │   ├── index.astro                ← dashboard
│   │   │   ├── catalog.astro              ← public read-only (no auth)
│   │   │   ├── inventory/
│   │   │   │   ├── index.astro
│   │   │   │   ├── new.astro
│   │   │   │   ├── [id].astro
│   │   │   │   └── [id]/
│   │   │   │       ├── units.astro
│   │   │   │       └── unit/[unitId].astro
│   │   │   ├── kits/
│   │   │   │   ├── index.astro
│   │   │   │   ├── new.astro
│   │   │   │   └── [id].astro
│   │   │   ├── users/
│   │   │   │   ├── index.astro
│   │   │   │   └── [id].astro
│   │   │   ├── borrows/
│   │   │   │   ├── index.astro
│   │   │   │   ├── new.astro
│   │   │   │   └── [id]/
│   │   │   │       ├── index.astro
│   │   │   │       ├── print.astro
│   │   │   │       └── return.astro
│   │   │   ├── reservations/
│   │   │   │   ├── index.astro
│   │   │   │   ├── new.astro
│   │   │   │   ├── calendar.astro
│   │   │   │   ├── pending.astro
│   │   │   │   └── [id].astro
│   │   │   └── locations.astro
│   │   └── api/
│   │       ├── health.ts
│   │       ├── auth/
│   │       │   ├── login.ts
│   │       │   ├── logout.ts
│   │       │   ├── me.ts
│   │       │   ├── refresh.ts
│   │       │   └── totp/
│   │       │       ├── enroll.ts
│   │       │       └── verify.ts
│   │       ├── labs/
│   │       │   ├── index.ts
│   │       │   └── [labId].ts
│   │       └── [labId]/                   ← all data routes scoped to a lab
│   │           ├── items/
│   │           │   ├── index.ts
│   │           │   ├── [id].ts
│   │           │   ├── [id]/
│   │           │   │   ├── units.ts
│   │           │   │   ├── accessories.ts
│   │           │   │   ├── assets.ts
│   │           │   │   ├── assets/fetch.ts
│   │           │   │   ├── availability.ts
│   │           │   │   └── label.ts
│   │           │   ├── barcode/[code].ts
│   │           │   └── bulk-import.ts
│   │           ├── units/
│   │           │   ├── [id].ts
│   │           │   └── [id]/label.ts
│   │           ├── kits/
│   │           │   ├── index.ts
│   │           │   └── [id].ts
│   │           ├── users/
│   │           │   ├── index.ts
│   │           │   ├── [id].ts
│   │           │   ├── [id]/export.ts
│   │           │   └── rfid/[tag].ts
│   │           ├── borrows/
│   │           │   ├── index.ts
│   │           │   ├── [id].ts
│   │           │   └── [id]/
│   │           │       ├── return.ts
│   │           │       ├── signature/[role].ts
│   │           │       ├── request-extension.ts
│   │           │       ├── approve-extension.ts
│   │           │       ├── reject-extension.ts
│   │           │       ├── print.ts
│   │           │       └── pdf.ts
│   │           ├── incident-reports/
│   │           │   ├── index.ts
│   │           │   └── [id].ts
│   │           ├── reservations/
│   │           │   ├── index.ts
│   │           │   ├── [id].ts
│   │           │   ├── [id]/
│   │           │   │   ├── instructor-approve.ts
│   │           │   │   ├── instructor-reject.ts
│   │           │   │   ├── manager-approve.ts
│   │           │   │   ├── manager-reject.ts
│   │           │   │   └── convert-to-borrow.ts
│   │           │   └── calendar.ts
│   │           ├── authorizations/
│   │           │   ├── index.ts
│   │           │   └── [id].ts
│   │           ├── alerts/
│   │           │   ├── index.ts
│   │           │   └── [id]/acknowledge.ts
│   │           ├── audit/index.ts
│   │           └── locations/
│   │               ├── index.ts
│   │               ├── diagram.ts
│   │               └── [id]/items.ts
│   ├── components/
│   │   ├── Scanner.tsx
│   │   ├── NfcReader.tsx
│   │   ├── SignaturePad.tsx
│   │   ├── BorrowForm.tsx
│   │   ├── ReturnForm.tsx
│   │   ├── KitPicker.tsx
│   │   ├── LocationDiagram.tsx
│   │   ├── OverduePanel.tsx
│   │   ├── PendingApprovalsPanel.tsx
│   │   ├── LabelPreview.tsx
│   │   └── CatalogSearch.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── totp.ts
│   │   ├── db.ts
│   │   ├── middleware.ts
│   │   ├── ratelimit.ts
│   │   ├── validate.ts
│   │   ├── eligibility.ts
│   │   ├── reservations.ts
│   │   ├── kits.ts
│   │   ├── barcode.ts
│   │   ├── print.ts
│   │   ├── assets.ts
│   │   ├── alerts.ts
│   │   ├── notifications.ts
│   │   ├── search.ts
│   │   ├── ids.ts
│   │   └── migrations.ts
│   └── data/
│       ├── _global/
│       │   ├── labs.json
│       │   ├── users.json
│       │   ├── lab_memberships.json
│       │   └── audit_log.json
│       └── {lab-id}/
│           ├── items.json
│           ├── units.json
│           ├── item_accessories.json
│           ├── kits.json
│           ├── borrows.json
│           ├── borrow_extensions.json
│           ├── incident_reports.json
│           ├── reservations.json
│           ├── owners.json
│           ├── locations.json
│           ├── availability_rules.json
│           ├── authorizations.json
│           ├── alerts.json
│           ├── audit_log.json
│           ├── media_assets.json
│           ├── location_diagram.json
│           └── config.json
├── public/
│   ├── manifest.webmanifest
│   └── sw.js
└── data/
    └── {lab-id}/
        ├── assets/{item-id}/
        └── uploads/{incident-id}/
```

---

## Multi-lab tenancy

Every data file lives under `src/data/{lab-id}/`. User accounts are global; roles are per-lab via `lab_memberships.json`.

### `labs.json` (`_global`)

```json
{
  "id": "uuid",
  "slug": "media-arts",
  "name": "Media Arts Lab",
  "room": "204",
  "contact_email": "medialab@university.edu",
  "is_active": true,
  "created_at": "ISO8601"
}
```

### `lab_memberships.json` (`_global`)

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "lab_id": "uuid",
  "role": "student",
  "user_type": "student",
  "student_level": 3,
  "instructor_ids": ["uuid"],
  "no_show_count": 0,
  "borrow_restricted_until": null,
  "is_active": true,
  "created_at": "ISO8601"
}
```

`role` enum: `admin | manager | technician | instructor | student | viewer`

A membership with `lab_id: "_global"` and `role: "admin"` is a **super-admin** who can manage all labs.

### JWT payload

```json
{
  "user_id": "uuid",
  "email": "a.demir@university.edu",
  "memberships": [
    { "lab_id": "uuid", "lab_slug": "media-arts", "role": "student", "user_type": "student" }
  ],
  "totp_verified": true,
  "iat": 0,
  "exp": 0
}
```

---

## Data schemas

### Inventory model: items vs units

| `tracking_mode` | When to use | Quantity model | Barcode scope |
|---|---|---|---|
| `serialized` | High-value, repairable, must trace history | Count of `units` where `status === "available"` | One barcode **per unit** |
| `bulk` | Low-cost, fungible (cables, resistors, batteries) | `quantity_available` counter on item | One barcode **per item** |

Switching `tracking_mode` after units or borrows reference an item is **forbidden** — PATCH handler returns `409`.

### `items.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "sku": "LAB-CAM-0001",
  "barcode": "LAB-2026-I-00042",
  "qr_code": "https://lab.example.com/media-arts/i/uuid",
  "name": "Canon EOS R5",
  "category": "camera",
  "brand": "Canon",
  "model": "EOS R5",
  "tracking_mode": "serialized",
  "quantity_total": null,
  "quantity_available": null,
  "min_stock_alert": null,
  "owner_id": "uuid",
  "default_location_id": "uuid",
  "availability_rule_id": "uuid",
  "datasheet_url": "https://...",
  "tutorial_links": ["https://..."],
  "manual_file_ids": ["uuid"],
  "label_size": "card",
  "notes": "",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "deleted_at": null
}
```

Rules:
- `serialized` → `quantity_total`, `quantity_available`, `min_stock_alert` MUST be `null`
- `bulk` → `quantity_total >= 1`, `0 <= quantity_available <= quantity_total`
- `min_stock_alert` (bulk only): triggers `low_stock` alert when `quantity_available <= min_stock_alert`

### `units.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "item_id": "uuid",
  "barcode": "LAB-2026-U-00417",
  "qr_code": "https://lab.example.com/media-arts/u/uuid",
  "serial_number": "SN123456",
  "asset_tag": "MEDIA-LAB-00042",
  "status": "available",
  "condition": "good",
  "current_borrow_id": null,
  "location_id": "uuid",
  "purchase_date": "ISO8601",
  "purchase_price": 4299.00,
  "warranty_until": "ISO8601",
  "notes": "",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "deleted_at": null
}
```

`status` enum: `available | borrowed | reserved | maintenance | retired | lost`
`condition` enum: `new | good | fair | damaged`

### `item_accessories.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "parent_item_id": "uuid",
  "accessory_item_id": "uuid",
  "relation_type": "required_accessory",
  "is_required": true,
  "quantity_required": 1
}
```

`relation_type` enum: `required_accessory | optional_accessory | included_in_kit | compatible_with`

### `kits.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "name": "Studio Portrait Kit",
  "version": 2,
  "description": "Full portrait lighting setup for MED-302",
  "availability_rule_id": "uuid",
  "lines": [
    { "item_id": "uuid", "quantity": 1, "is_required": true },
    { "item_id": "uuid-sd-card", "quantity": 2, "is_required": true },
    { "item_id": "uuid-cable", "quantity": 1, "is_required": false }
  ],
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "deleted_at": null
}
```

`expandKit(labId, kitId)` in `src/lib/kits.ts` returns the kit lines as `BorrowLineInput[]`.

### `users.json` (`_global`)

```json
{
  "id": "uuid",
  "rfid_tag": "04:A3:2B:C1",
  "name": "Ayşe Demir",
  "email": "a.demir@university.edu",
  "password_hash": "$2b$10$...",
  "must_change_password": false,
  "totp_secret_enc": null,
  "totp_enabled": false,
  "is_active": true,
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "redacted_at": null
}
```

Lab-specific fields (`role`, `student_level`, `no_show_count`, etc.) live in `lab_memberships.json`.

### `borrows.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "user_id": "uuid",
  "reservation_id": "uuid-or-null",
  "kit_id": "uuid-or-null",
  "lines": [
    {
      "id": "uuid",
      "item_id": "uuid",
      "unit_id": "uuid-or-null",
      "quantity": 1,
      "is_accessory": false,
      "is_required": true,
      "borrowed_condition": "good",
      "returned_condition": null,
      "returned_quantity": 0,
      "returned_at": null,
      "incident_report_id": null
    }
  ],
  "borrowed_at": "ISO8601",
  "due_date": "ISO8601",
  "max_due_date": "ISO8601",
  "returned_at": null,
  "status": "active",
  "approved_by": "uuid",
  "instructor_auth_id": "uuid-or-null",
  "borrower_sig_data": "data:image/png;base64,...",
  "technician_sig_data": "data:image/png;base64,...",
  "return_sig_data": null,
  "print_token": "signed-token-hash",
  "penalty_level": 0,
  "notes": "",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

`status` enum: `active | partially_returned | returned | overdue | cancelled`
`penalty_level`: `0` = none, `1` = warning issued, `2` = suspension applied

- `max_due_date` = `borrowed_at + rule.max_borrow_days`. Extension requests cannot push `due_date` past this.
- **Early return**: settle all remaining lines with `returned_quantity = line.quantity`. Borrow flips to `returned`. Record stays; disappears from active views via status filter.
- **Cancellation** (item never left): set `status: "cancelled"`, restore stock, audit. Record stays.

### `borrow_extensions.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "borrow_id": "uuid",
  "requested_by": "uuid",
  "requested_due_date": "ISO8601",
  "status": "pending",
  "reviewed_by": null,
  "reviewed_at": null,
  "rejection_reason": "",
  "created_at": "ISO8601"
}
```

`status` enum: `pending | approved | rejected`

On approval: `borrows.due_date` is updated; overdue alerts for that borrow are resolved.

### `incident_reports.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "borrow_id": "uuid",
  "borrow_line_id": "uuid",
  "unit_id": "uuid-or-null",
  "item_id": "uuid",
  "kind": "damage",
  "severity": "minor",
  "description": "Lens cap missing; small dent on hood",
  "photo_paths": ["data/uploads/incident-uuid/1.jpg"],
  "reported_by": "uuid",
  "reported_at": "ISO8601",
  "resolved_at": null,
  "resolution_notes": ""
}
```

`kind` enum: `damage | loss | missing_part | malfunction | misuse`
`severity` enum: `minor | major | total_loss`

### `reservations.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "user_id": "uuid",
  "kit_id": "uuid-or-null",
  "lines": [
    { "id": "uuid", "item_id": "uuid", "unit_id": null, "quantity": 1 }
  ],
  "start_at": "ISO8601",
  "end_at": "ISO8601",
  "purpose": "Final project: studio portrait shoot",
  "course_code": "MED-302",
  "status": "pending_instructor",
  "instructor_id": "uuid-or-null",
  "instructor_decision_at": null,
  "instructor_notes": "",
  "manager_decision_by": null,
  "manager_decision_at": null,
  "manager_notes": "",
  "rejection_reason": "",
  "borrow_id": null,
  "cancelled_at": null,
  "cancelled_by": null,
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

`status` enum: `draft | pending_instructor | pending_manager | approved | active | completed | rejected | cancelled | expired`

**Workflow:**
```
student submit ──▶ pending_instructor ──▶ pending_manager ──▶ approved ──▶ active ──▶ completed
                          │                      │
                          └──reject──▶ rejected ◀┘
non-student ─────────────────────────▶ pending_manager
user cancel (any pre-active) ──▶ cancelled
no-show past grace ──▶ cancelled (system)
stale pending past TTL ──▶ expired (system)
```

**Visibility rules:**
- Students: only their own reservations
- Instructors: only reservations where `instructor_id === their user_id`
- Managers/Admins: all in their lab

### `alerts.json`

```json
{
  "id": "uuid",
  "lab_id": "uuid",
  "kind": "overdue",
  "borrow_id": "uuid-or-null",
  "reservation_id": "uuid-or-null",
  "item_id": "uuid-or-null",
  "user_id": "uuid-or-null",
  "message": "Borrow LAB-B-00042 is 4 days overdue",
  "triggered_at": "ISO8601",
  "resolved_at": null,
  "severity": "critical",
  "acknowledged": false,
  "acknowledged_by": null,
  "acknowledged_at": null
}
```

`kind` enum: `overdue | low_stock | pending_approval | no_show | incident_open | warranty_expiring | extension_requested`
`severity` enum: `info | warning | overdue | critical`

### `audit_log.json` (per-lab + `_global`)

Append-only. Never rewritten. HMAC-chained.

```json
{
  "id": "uuid",
  "ts": "ISO8601",
  "lab_id": "uuid-or-null",
  "actor_id": "uuid",
  "actor_role": "technician",
  "action": "reservation.manager_approve",
  "entity_type": "reservation",
  "entity_id": "uuid",
  "before": { "status": "pending_manager" },
  "after":  { "status": "approved" },
  "request_id": "req_01HW...",
  "ip": "10.0.4.12",
  "user_agent": "Mozilla/5.0...",
  "hmac": "sha256-of-prev-entry-id-plus-this-payload"
}
```

The `hmac` is `HMAC-SHA256(AUDIT_HMAC_SECRET, prev_entry_id + ":" + canonical_json_of_this_entry)`. Tampering with any entry invalidates all subsequent HMACs. The `GET /api/{labId}/audit` endpoint includes `chain_valid: boolean` computed on read; a broken chain triggers a `critical` alert.

### `config.json` (per-lab, single-object file)

```json
{
  "lab_id": "uuid",
  "schema_version": 1,
  "pending_ttl_hours": 72,
  "no_show_grace_minutes": 30,
  "no_show_restriction_threshold": 3,
  "no_show_restriction_days": 14,
  "max_advance_booking_days": 60,
  "min_lead_time_minutes_student": 60,
  "min_lead_time_minutes_staff": 0,
  "default_max_borrow_days": 7,
  "penalty_warning_days_overdue": 1,
  "penalty_suspension_days_overdue": 2,
  "penalty_suspension_duration_days": 14,
  "low_stock_check_cron": "0 8 * * *",
  "require_return_signature": true
}
```

---

## Database layer (`src/lib/db.ts`)

```typescript
import { readFileSync, writeFileSync, renameSync, statSync } from 'fs';
import { lock } from 'proper-lockfile';
import { join } from 'path';

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'src/data');

// In-memory cache keyed by absolute path
const cache = new Map<string, { data: unknown[]; mtime: number }>();

export function readDb<T>(labId: string, file: string): T[] {
  const path = join(DATA_DIR, labId, file);
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
  renameSync(path + '.tmp', path); // atomic on POSIX
  cache.delete(path);
}

// Lock files in canonical alphabetical order — always.
export async function withLocks<T>(
  labId: string,
  files: string[],
  fn: () => Promise<T>
): Promise<T> {
  const sorted = [...new Set(files)].sort();
  const paths = sorted.map(f => join(DATA_DIR, labId, f));
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

// commit() — the ONLY path for persisting mutations.
// All files must be locked via withLocks() before calling commit().
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
```

**Rules — violations are bugs:**
- Never call `fs` directly in route handlers. Always use `readDb` / `commit`.
- Every mutation uses `commit()`. No exceptions.
- Lock canonical alphabetical order: `alerts.json` → `borrow_extensions.json` → `borrows.json` → `items.json` → `lab_memberships.json` → `reservations.json` → `units.json` → `users.json`.
- Run conflict detection *inside* the lock, never before.
- Soft-delete only: set `deleted_at`. Never splice records.
- Filter `deleted_at !== null` in all list reads.
- After every bulk item write, assert `0 <= quantity_available <= quantity_total`.

---

## Auth (`src/lib/auth.ts`)

```typescript
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET!;

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, SECRET, { expiresIn: '8h' });

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as JwtPayload;

export const getMembership = (user: JwtPayload, labId: string) =>
  user.memberships.find(m => m.lab_id === labId);

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
  path: '/',
});
```

### TOTP (`src/lib/totp.ts`)

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateSecret = (email: string, labName: string) =>
  speakeasy.generateSecret({ name: `${labName} (${email})`, length: 20 });

export const verifyTotp = (secret: string, token: string) =>
  speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });

export const generateQr = (otpauthUrl: string) =>
  QRCode.toDataURL(otpauthUrl);
```

Store `totp_secret_enc` as AES-256-GCM encrypted bytes in `users.json`. Never store the raw secret. Enrollment: `POST /api/auth/totp/enroll` → QR → user scans → `POST /api/auth/totp/verify` confirms and sets `totp_enabled: true`. Login with TOTP issues a short-lived `partial` token after password check; the full JWT is issued only after TOTP verification.

### Middleware (`src/lib/middleware.ts`)

```typescript
const ROLE_HIERARCHY = {
  admin: 6, manager: 5, technician: 4, instructor: 3, student: 2, viewer: 1,
} as const;

export function withAuth(
  handler: (ctx: APIContext, user: JwtPayload, membership: LabMembership) => Promise<Response>,
  options: { minRole?: Role; anyOf?: Role[] } = {}
) {
  return async (ctx: APIContext): Promise<Response> => {
    const token = ctx.cookies.get('token')?.value;
    if (!token) return err(401, 'Unauthorized');
    let user: JwtPayload;
    try { user = verifyToken(token); } catch { return err(401, 'Unauthorized'); }
    if ((user as any).partial) return err(401, 'TOTP verification required');

    const labId = ctx.params.labId;
    const membership = getMembership(user, labId);
    const isSuper = user.memberships.some(m => m.lab_id === '_global' && m.role === 'admin');
    if (!membership && !isSuper) return err(403, 'Forbidden');

    const role = (membership?.role ?? 'admin') as Role;
    if (options.minRole && ROLE_HIERARCHY[role] < ROLE_HIERARCHY[options.minRole]) return err(403, 'Forbidden');
    if (options.anyOf && !options.anyOf.includes(role)) return err(403, 'Forbidden');

    return handler(ctx, user, membership!);
  };
}
```

### Rate limiting (`src/lib/ratelimit.ts`)

```typescript
const buckets = new Map<string, { tokens: number; last: number }>();

export function rateLimit(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: maxPerMinute, last: now };
  b.tokens = Math.min(maxPerMinute, b.tokens + ((now - b.last) / 60_000) * maxPerMinute);
  b.last = now;
  if (b.tokens < 1) { buckets.set(key, b); return false; }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}
```

Apply at the top of the login handler: `rateLimit(\`login:${ip}\`, 5)`.

---

## Validation (`src/lib/validate.ts`)

```typescript
import { z } from 'zod';

export const ItemSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  tracking_mode: z.enum(['serialized', 'bulk']),
  quantity_total: z.number().int().min(1).nullable(),
  quantity_available: z.number().int().min(0).nullable(),
  min_stock_alert: z.number().int().min(0).nullable(),
  owner_id: z.string().uuid().optional(),
  default_location_id: z.string().uuid().optional(),
  availability_rule_id: z.string().uuid().optional(),
  label_size: z.enum(['standard', 'card']).default('standard'),
  notes: z.string().max(2000).optional(),
}).superRefine((v, ctx) => {
  if (v.tracking_mode === 'serialized') {
    if (v.quantity_total !== null || v.quantity_available !== null)
      ctx.addIssue({ code: 'custom', message: 'Serialized items must not carry quantity fields' });
  } else {
    if (v.quantity_total === null || v.quantity_available === null)
      ctx.addIssue({ code: 'custom', message: 'Bulk items must have quantity_total and quantity_available' });
    else if (v.quantity_available > v.quantity_total)
      ctx.addIssue({ code: 'custom', message: 'quantity_available cannot exceed quantity_total' });
  }
});

export const UnitSchema = z.object({
  item_id: z.string().uuid(),
  serial_number: z.string().max(120).optional(),
  asset_tag: z.string().max(60).optional(),
  condition: z.enum(['new', 'good', 'fair', 'damaged']).default('good'),
  location_id: z.string().uuid().optional(),
  purchase_date: z.string().datetime().optional(),
  purchase_price: z.number().nonnegative().optional(),
  warranty_until: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

const LineSchema = z.object({
  item_id: z.string().uuid(),
  unit_id: z.string().uuid().nullable(),
  quantity: z.number().int().min(1),
  is_accessory: z.boolean().default(false),
  is_required: z.boolean().default(false),
});

export const BorrowSchema = z.object({
  user_id: z.string().uuid(),
  reservation_id: z.string().uuid().optional(),
  kit_id: z.string().uuid().optional(),
  due_date: z.string().datetime(),
  lines: z.array(LineSchema).min(1).max(50),
  notes: z.string().max(2000).optional(),
});

export const ReturnSchema = z.object({
  lines: z.array(z.object({
    line_id: z.string().uuid(),
    returned_quantity: z.number().int().min(0),
    returned_condition: z.enum(['new', 'good', 'fair', 'damaged']).optional(),
    has_incident: z.boolean().default(false),
  })).min(1),
  notes: z.string().max(2000).optional(),
});

export const ExtensionRequestSchema = z.object({
  requested_due_date: z.string().datetime(),
  reason: z.string().min(3).max(1000),
});

export const ReservationSchema = z.object({
  user_id: z.string().uuid(),
  instructor_id: z.string().uuid().nullable(),
  kit_id: z.string().uuid().nullable().optional(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  purpose: z.string().min(3).max(500),
  course_code: z.string().max(40).optional(),
  lines: z.array(LineSchema).min(1).max(50),
}).refine(v => new Date(v.end_at) > new Date(v.start_at), {
  message: 'end_at must be after start_at',
});

export const SignatureSchema = z.object({
  sig_data: z.string().startsWith('data:image/png;base64,').max(500_000),
});

// Use on every barcode/RFID value before filesystem or query use
export const sanitizeCode = (raw: string) =>
  raw.replace(/[^A-Za-z0-9:\-]/g, '').slice(0, 60);
```

---

## Borrow transaction (core logic)

```typescript
export async function createBorrow(labId: string, input: BorrowInput): Promise<BorrowRecord> {
  return withLocks(
    labId,
    ['borrows.json', 'items.json', 'reservations.json', 'units.json'],
    async () => {
      const items        = readDb<Item>(labId, 'items.json');
      const units        = readDb<Unit>(labId, 'units.json');
      const borrows      = readDb<BorrowRecord>(labId, 'borrows.json');
      const reservations = readDb<Reservation>(labId, 'reservations.json');

      // Expand kit lines if kit_id supplied
      const lines = input.kit_id
        ? expandKit(labId, input.kit_id, input.lines)
        : input.lines;

      // Validate reservation state if converting
      let reservation: Reservation | undefined;
      if (input.reservation_id) {
        reservation = reservations.find(r => r.id === input.reservation_id);
        if (!reservation) throw new ApiError(404, 'Reservation not found');
        if (reservation.status !== 'approved') {
          throw new ApiError(409, `Reservation is ${reservation.status}, not approved`);
        }
      }

      const allocatedUnitIds = new Set<string>();
      const builtLines: BorrowLine[] = [];

      for (const line of lines) {
        const item = items.find(i => i.id === line.item_id && !i.deleted_at);
        if (!item) throw new ApiError(404, `Item ${line.item_id} not found`);
        await assertEligible(labId, item, input.user);

        if (item.tracking_mode === 'serialized') {
          if (line.quantity !== 1) throw new ApiError(422, 'Serialized line must have quantity = 1');
          let unitId = line.unit_id;
          if (!unitId) {
            const free = units.find(u =>
              u.item_id === item.id && u.status === 'available' &&
              !u.deleted_at && !allocatedUnitIds.has(u.id)
            );
            if (!free) throw new ApiError(409, `No available unit for "${item.name}"`);
            unitId = free.id;
          }
          const unit = units.find(u => u.id === unitId);
          if (!unit || unit.deleted_at) throw new ApiError(404, `Unit ${unitId} not found`);
          if (unit.status !== 'available') {
            throw new ApiError(409, `Unit ${unit.serial_number ?? unitId} is ${unit.status}`);
          }
          allocatedUnitIds.add(unitId);
          unit.status = 'borrowed';
          unit.current_borrow_id = '__pending__';
          builtLines.push(makeLine(line, item, unitId, unit.condition));
        } else {
          if (item.quantity_available! < line.quantity) {
            throw new ApiError(409, `Only ${item.quantity_available} of "${item.name}" available`);
          }
          item.quantity_available! -= line.quantity;
          // Invariant check
          if (item.quantity_available! < 0 || item.quantity_available! > item.quantity_total!) {
            throw new Error('INVARIANT: quantity_available out of bounds after decrement');
          }
          builtLines.push(makeLine(line, item, null, null));
        }
      }

      const cfg = readDb<Config>(labId, 'config.json')[0];
      const now = new Date().toISOString();
      const record: BorrowRecord = {
        id: crypto.randomUUID(),
        lab_id: labId,
        user_id: input.user.user_id,
        reservation_id: input.reservation_id ?? null,
        kit_id: input.kit_id ?? null,
        lines: builtLines,
        borrowed_at: now,
        due_date: input.due_date,
        max_due_date: new Date(Date.now() + cfg.default_max_borrow_days * 86_400_000).toISOString(),
        returned_at: null,
        status: 'active',
        approved_by: null,
        instructor_auth_id: null,
        borrower_sig_data: null,
        technician_sig_data: null,
        return_sig_data: null,
        print_token: '',
        penalty_level: 0,
        notes: input.notes ?? '',
        created_at: now,
        updated_at: now,
      };

      // Patch __pending__ with real ID
      for (const u of units) {
        if (u.current_borrow_id === '__pending__') u.current_borrow_id = record.id;
      }
      record.print_token = generatePrintToken(record.id);

      if (reservation) {
        reservation.status = 'active';
        reservation.borrow_id = record.id;
        reservation.updated_at = now;
      }

      await commit({
        labId,
        writes: [
          ['items.json', items],
          ['units.json', units],
          ['borrows.json', [...borrows, record]],
          ['reservations.json', reservations],
        ],
        audit: {
          action: 'borrow.create', entity_type: 'borrow', entity_id: record.id,
          actor_id: input.user.user_id, actor_role: getMembership(input.user, labId)!.role,
          after: { line_count: record.lines.length, due_date: record.due_date },
        },
      });

      return record;
    }
  );
}
```

---

## Return flow

```typescript
export async function recordReturn(labId: string, borrowId: string, input: ReturnInput, actor: JwtPayload) {
  return withLocks(labId, ['borrows.json', 'items.json', 'units.json'], async () => {
    const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
    const items   = readDb<Item>(labId, 'items.json');
    const units   = readDb<Unit>(labId, 'units.json');
    const borrow  = borrows.find(b => b.id === borrowId);
    if (!borrow) throw new ApiError(404, 'Borrow not found');
    if (borrow.status === 'returned' || borrow.status === 'cancelled') {
      throw new ApiError(409, `Borrow is already ${borrow.status}`);
    }

    const now = new Date().toISOString();
    for (const ret of input.lines) {
      const line = borrow.lines.find(l => l.id === ret.line_id);
      if (!line) throw new ApiError(404, `Line ${ret.line_id} not found`);
      const remaining = line.quantity - line.returned_quantity;
      if (ret.returned_quantity > remaining) {
        throw new ApiError(422, `Cannot return ${ret.returned_quantity}; only ${remaining} remaining`);
      }
      line.returned_quantity += ret.returned_quantity;
      if (ret.returned_condition) line.returned_condition = ret.returned_condition;
      if (line.returned_quantity >= line.quantity) line.returned_at = now;

      if (line.unit_id) {
        const unit = units.find(u => u.id === line.unit_id)!;
        unit.status = 'available';
        unit.current_borrow_id = null;
        if (ret.returned_condition) unit.condition = ret.returned_condition;
      } else {
        const item = items.find(i => i.id === line.item_id)!;
        item.quantity_available = Math.min(
          item.quantity_available! + ret.returned_quantity,
          item.quantity_total!
        );
      }
    }

    const allSettled = borrow.lines.every(l => l.returned_quantity >= l.quantity);
    const anySettled = borrow.lines.some(l => l.returned_quantity > 0);
    borrow.status = allSettled ? 'returned' : anySettled ? 'partially_returned' : borrow.status;
    if (allSettled) borrow.returned_at = now;
    borrow.updated_at = now;

    await commit({
      labId,
      writes: [['borrows.json', borrows], ['items.json', items], ['units.json', units]],
      audit: {
        action: allSettled ? 'borrow.return' : 'borrow.partial_return',
        entity_type: 'borrow', entity_id: borrowId,
        actor_id: actor.user_id, actor_role: getMembership(actor, labId)!.role,
        after: { status: borrow.status },
      },
    });

    return borrow;
  });
}
```

---

## Eligibility check (`src/lib/eligibility.ts`)

```typescript
export async function assertEligible(labId: string, item: Item, user: JwtPayload): Promise<string | null> {
  const membership = getMembership(user, labId);
  if (!membership) throw new ApiError(403, 'Not a member of this lab');

  if (membership.borrow_restricted_until && new Date(membership.borrow_restricted_until) > new Date()) {
    throw new ApiError(403,
      `Borrowing suspended until ${membership.borrow_restricted_until} due to no-shows or policy violation.`
    );
  }

  const rules = readDb<AvailabilityRule>(labId, 'availability_rules.json');
  const rule = item.availability_rule_id ? rules.find(r => r.id === item.availability_rule_id) : null;
  if (!rule) return null;

  if (!rule.allowed_user_types.includes(membership.user_type)) {
    throw new ApiError(403, `This item is not available to ${membership.user_type} users`);
  }
  if (membership.user_type === 'student' && membership.student_level < rule.min_student_level) {
    throw new ApiError(403, `This item requires year ${rule.min_student_level} or above`);
  }
  if (rule.requires_instructor_auth && membership.user_type === 'student') {
    const auths = readDb<Authorization>(labId, 'authorizations.json');
    const valid = auths.find(a =>
      a.student_id === user.user_id &&
      a.item_category === item.category &&
      a.is_active &&
      new Date(a.expires_at) > new Date()
    );
    if (!valid) throw new ApiError(403, 'An instructor authorization is required for this item category');
    return valid.id;
  }
  return null;
}
```

---

## Loan extensions

```typescript
// POST /api/{labId}/borrows/:id/request-extension
export async function requestExtension(labId: string, borrowId: string, input: ExtensionInput, actor: JwtPayload) {
  const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
  const borrow = borrows.find(b => b.id === borrowId);
  if (!borrow) throw new ApiError(404, 'Not found');
  if (borrow.user_id !== actor.user_id) throw new ApiError(403, 'Not your borrow');
  if (['returned', 'cancelled'].includes(borrow.status)) {
    throw new ApiError(409, 'Cannot extend a completed borrow');
  }
  if (new Date(input.requested_due_date) > new Date(borrow.max_due_date)) {
    throw new ApiError(422, `Requested date exceeds maximum allowed (${borrow.max_due_date})`);
  }
  const existing = readDb<BorrowExtension>(labId, 'borrow_extensions.json')
    .find(e => e.borrow_id === borrowId && e.status === 'pending');
  if (existing) throw new ApiError(409, 'An extension is already pending');

  const ext: BorrowExtension = {
    id: crypto.randomUUID(), lab_id: labId, borrow_id: borrowId,
    requested_by: actor.user_id, requested_due_date: input.requested_due_date,
    status: 'pending', reviewed_by: null, reviewed_at: null,
    rejection_reason: '', created_at: new Date().toISOString(),
  };
  await appendDb(labId, 'borrow_extensions.json', ext);
  await createAlert(labId, { kind: 'extension_requested', borrow_id: borrowId,
    severity: 'info', message: `Extension requested for borrow ${borrowId}` });
  return ext;
}

// POST /api/{labId}/borrows/:id/approve-extension
export async function approveExtension(labId: string, borrowId: string, actor: JwtPayload) {
  return withLocks(labId, ['borrow_extensions.json', 'borrows.json'], async () => {
    const borrows    = readDb<BorrowRecord>(labId, 'borrows.json');
    const extensions = readDb<BorrowExtension>(labId, 'borrow_extensions.json');
    const borrow     = borrows.find(b => b.id === borrowId);
    const ext        = extensions.find(e => e.borrow_id === borrowId && e.status === 'pending');
    if (!ext || !borrow) throw new ApiError(404, 'Not found');

    ext.status = 'approved';
    ext.reviewed_by = actor.user_id;
    ext.reviewed_at = new Date().toISOString();
    borrow.due_date = ext.requested_due_date;
    borrow.updated_at = ext.reviewed_at;

    await resolveAlerts(labId, { borrow_id: borrowId });
    await commit({
      labId,
      writes: [['borrows.json', borrows], ['borrow_extensions.json', extensions]],
      audit: { action: 'extension.approve', entity_type: 'borrow', entity_id: borrowId,
               actor_id: actor.user_id, actor_role: getMembership(actor, labId)!.role,
               after: { new_due_date: borrow.due_date } },
    });
    return borrow;
  });
}
```

---

## Penalty escalation (part of the hourly overdue cron)

```typescript
async function applyPenalties(labId: string, borrow: BorrowRecord, daysOverdue: number) {
  const cfg = readDb<Config>(labId, 'config.json')[0];
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const m = memberships.find(x => x.user_id === borrow.user_id && x.lab_id === labId);
  if (!m) return;

  if (daysOverdue >= cfg.penalty_suspension_days_overdue && borrow.penalty_level < 2) {
    m.borrow_restricted_until = new Date(
      Date.now() + cfg.penalty_suspension_duration_days * 86_400_000
    ).toISOString();
    borrow.penalty_level = 2;
    await notifyUser(borrow.user_id, 'borrow_suspended',
      { borrow_id: borrow.id, until: m.borrow_restricted_until });
  } else if (daysOverdue >= cfg.penalty_warning_days_overdue && borrow.penalty_level < 1) {
    borrow.penalty_level = 1;
    await notifyUser(borrow.user_id, 'borrow_overdue_warning', { borrow_id: borrow.id });
  }
}
```

---

## Conflict detection (`src/lib/reservations.ts`)

`findConflicts()` must be called inside the composite lock at three points: `createReservation`, `manager-approve`, and `convert-to-borrow`. Never trust a free count computed before locking.

```typescript
export function findConflicts(
  labId: string,
  candidate: { lines: LineInput[]; start_at: string; end_at: string; exclude_id?: string }
): Conflict[] {
  const items   = readDb<Item>(labId, 'items.json');
  const units   = readDb<Unit>(labId, 'units.json');
  const reservations = readDb<Reservation>(labId, 'reservations.json')
    .filter(r => r.id !== candidate.exclude_id)
    .filter(r => ['pending_manager', 'approved', 'active'].includes(r.status));
  const activeBorrows = readDb<BorrowRecord>(labId, 'borrows.json')
    .filter(b => b.status === 'active' || b.status === 'partially_returned');

  const start = new Date(candidate.start_at).getTime();
  const end   = new Date(candidate.end_at).getTime();
  const overlaps = (a: number, b: number, s: string, e: string) =>
    a < new Date(e).getTime() && new Date(s).getTime() < b;

  const conflicts: Conflict[] = [];

  for (const line of candidate.lines) {
    const item = items.find(i => i.id === line.item_id)!;

    if (item.tracking_mode === 'serialized') {
      const itemUnits = units.filter(u =>
        u.item_id === item.id && !u.deleted_at && u.status !== 'retired'
      );
      const busyUnitIds = new Set<string>();

      for (const r of reservations.filter(r => overlaps(start, end, r.start_at, r.end_at))) {
        for (const rl of r.lines.filter(l => l.item_id === item.id)) {
          if (rl.unit_id) busyUnitIds.add(rl.unit_id);
          else {
            // Generic hold — mark the first free units as busy
            itemUnits.filter(u => !busyUnitIds.has(u.id))
              .slice(0, rl.quantity)
              .forEach(u => busyUnitIds.add(u.id));
          }
        }
      }
      for (const b of activeBorrows) {
        for (const bl of b.lines.filter(l => l.unit_id && l.item_id === item.id && !l.returned_at)) {
          busyUnitIds.add(bl.unit_id!);
        }
      }

      const freeCount = itemUnits.filter(u => !busyUnitIds.has(u.id)).length;
      if (line.unit_id) {
        if (busyUnitIds.has(line.unit_id)) conflicts.push({ item_id: item.id, unit_id: line.unit_id });
      } else if (freeCount < line.quantity) {
        conflicts.push({ item_id: item.id, requested: line.quantity, free: freeCount });
      }
    } else {
      const reserved = reservations
        .filter(r => overlaps(start, end, r.start_at, r.end_at))
        .flatMap(r => r.lines.filter(l => l.item_id === item.id))
        .reduce((s, l) => s + l.quantity, 0);
      const borrowed = activeBorrows
        .flatMap(b => b.lines.filter(l => l.item_id === item.id && !l.unit_id && !l.returned_at))
        .reduce((s, l) => s + (l.quantity - l.returned_quantity), 0);
      const free = item.quantity_total! - reserved - borrowed;
      if (free < line.quantity) {
        conflicts.push({ item_id: item.id, requested: line.quantity, free });
      }
    }
  }
  return conflicts;
}
```

---

## Print token

```typescript
import { createHmac } from 'crypto';
const PRINT_SECRET = process.env.PRINT_TOKEN_SECRET!;

export function generatePrintToken(borrowId: string): string {
  const expires = Date.now() + 3_600_000;
  const payload = `${borrowId}:${expires}`;
  const sig = createHmac('sha256', PRINT_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifyPrintToken(token: string, borrowId: string): boolean {
  try {
    const [id, expires, sig] = Buffer.from(token, 'base64url').toString().split(':');
    if (id !== borrowId || Date.now() > parseInt(expires)) return false;
    return sig === createHmac('sha256', PRINT_SECRET).update(`${id}:${expires}`).digest('hex');
  } catch { return false; }
}
```

Receive the token via `Authorization: Bearer <token>` header or POST body — **never** as a query string (avoids proxy log exposure).

---

## Barcode formats & label printing

**Formats:**
- Item (bulk): `LAB-{YEAR}-I-{5-digit}` e.g. `LAB-2026-I-00042`
- Unit (serialized): `LAB-{YEAR}-U-{5-digit}` e.g. `LAB-2026-U-00417`

The `I`/`U` discriminator lets `GET /api/{labId}/items/barcode/:code` dispatch to the correct table without reading both files.

**Label templates** (selected by `item.label_size`):
- `standard` (62mm × 29mm thermal): name, barcode, ID + lab name
- `card` (85.6mm × 53.98mm): photo left, name/barcode/serial right, lab name + QR footer

**Label endpoints:**
- `GET /api/{labId}/items/:id/label?format=pdf` — single bulk item label
- `GET /api/{labId}/items/:id/label?format=sheet&count=8` — 8 card labels tiled on A4
- `GET /api/{labId}/units/:id/label?format=pdf` — single unit label
- `GET /api/{labId}/items/:id/label?format=units-sheet` — one label per unit on a single sheet

---

## Signature capture (`SignaturePad.tsx`)

```tsx
import SignaturePad from 'signature_pad';
import { useEffect, useRef } from 'react';

export function SignatureCapture({ label, onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    padRef.current = new SignaturePad(canvasRef.current, {
      backgroundColor: 'rgb(255,255,255)', penColor: 'rgb(0,0,0)',
    });
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
    canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
    canvasRef.current.getContext('2d')?.scale(ratio, ratio);
  }, []);

  const handleSave = () => {
    if (padRef.current?.isEmpty()) return;
    // Downsample to 600x200 before encoding to keep size under 500 KB
    const offscreen = document.createElement('canvas');
    offscreen.width = 600; offscreen.height = 200;
    offscreen.getContext('2d')!.drawImage(canvasRef.current!, 0, 0, 600, 200);
    const data = offscreen.toDataURL('image/png');
    if (data.length > 500_000) { alert('Signature too large. Please sign again.'); return; }
    onSave(data);
  };

  return (
    <div>
      <p>{label}</p>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc', width: '100%', height: '160px' }} />
      <button onClick={() => padRef.current?.clear()}>Clear</button>
      <button onClick={handleSave}>Save signature</button>
    </div>
  );
}
```

---

## NFC reader with iOS fallback (`NfcReader.tsx`)

```tsx
const nfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

export function NfcReader({ onTag }: { onTag: (tag: string) => void }) {
  if (!nfcSupported) {
    return (
      <input
        placeholder="RFID tag (e.g. 04:A3:2B:C1)"
        onChange={e => onTag(sanitizeCode(e.target.value))}
      />
    );
  }
  // Web NFC path for Android Chrome
  return <NfcScanButton onTag={onTag} />;
}
```

Always render the manual entry fallback. Test it on iOS and desktop on every iteration.

---

## Schema migrations (`migrations/runner.ts`)

```typescript
const MIGRATIONS = [
  { version: 1, up: async (labId: string) => { /* initial seed */ } },
  { version: 2, up: async (labId: string) => { /* add penalty_level to borrows */ } },
  // append new entries; never edit existing
];

export async function runMigrations(labId: string) {
  const config = readDb<Config>(labId, 'config.json')[0];
  const current = config.schema_version ?? 0;
  for (const m of MIGRATIONS.filter(x => x.version > current)) {
    console.log(`[migration] lab ${labId}: v${m.version}`);
    await m.up(labId);
    config.schema_version = m.version;
    await commit({ labId, writes: [['config.json', [config]]],
      audit: { action: 'migration.run', entity_type: 'config', entity_id: labId,
               actor_id: 'system', actor_role: 'system', after: { schema_version: m.version } } });
  }
}
```

Called at boot for every active lab before the first request is served.

---

## Environment variables

```bash
# .env.example
NODE_ENV=production
JWT_SECRET=                      # min 32 random chars
PRINT_TOKEN_SECRET=              # independent, min 32 random chars
AUDIT_HMAC_SECRET=               # independent, min 32 random chars
LAB_REQUIRE_2FA_ADMIN=true
DATA_DIR=./src/data
PORT=4321

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Lab Manager <noreply@lab.example.com>"
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@lab.example.com

RATE_LIMIT_LOGIN_PER_MIN=5
RATE_LIMIT_API_PER_MIN=300

BACKUP_DIR=/backups
BACKUP_RETENTION_DAYS=30
```

---

## Caddy (with CSP)

```
lab.example.com {
  reverse_proxy localhost:4321
  encode gzip
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Frame-Options DENY
    X-Content-Type-Options nosniff
    Referrer-Policy strict-origin-when-cross-origin
    Permissions-Policy "camera=self, nfc=self"
    Content-Security-Policy "default-src 'self'; img-src 'self' data: blob:; style-src 'self' https://1.www.s81c.com 'unsafe-inline'; font-src 'self' https://1.www.s81c.com; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  }
}
```

---

## Build & run

```bash
npm install
npm run dev                                       # hot reload
npm run build
node ./dist/server/entry.mjs                      # production

npx tsx scripts/seed.ts                           # first run: super-admin + first lab
npx tsx scripts/fetch-assets.ts <lab-id>          # initial asset population
npx tsx scripts/check-overdue.ts <lab-id>         # manual overdue sweep
npx tsx scripts/bulk-import.ts <lab-id> items.csv # CSV import
```

---

## Implementation order

**Phase 1 — Foundation**
1. Astro scaffold with Node SSR adapter
2. `.env` + `DATA_DIR` config loading
3. `src/lib/db.ts` — `readDb` (cached), `withLocks`, `commit`
4. `migrations/runner.ts` + boot hook
5. `src/lib/auth.ts` + `src/lib/middleware.ts` (multi-lab JWT)
6. `src/lib/ratelimit.ts`
7. `src/lib/validate.ts` — all zod schemas + `sanitizeCode`
8. `GET /api/health`
9. Seed script

**Phase 2 — Core inventory**
10. `POST /api/{labId}/items` + barcode/QR generation
11. `POST /api/{labId}/items/:id/units`
12. `GET` list/detail endpoints for items and units
13. `PATCH` — guard `tracking_mode` switch
14. `DELETE` — refuse if active borrows exist
15. `GET /api/{labId}/items/barcode/:code` — `I`/`U` dispatch
16. `GET /api/{labId}/items/:id/availability` — window free-count feed
17. Kit CRUD + `expandKit()`

**Phase 3 — Users, memberships, authorizations**
18. User + membership CRUD
19. `GET /api/{labId}/users/rfid/:tag`
20. Instructor authorization grant/revoke
21. Password reset + TOTP enroll/verify
22. `GET /api/{labId}/users/:id/export`

**Phase 4 — Borrow transaction**
23. `POST /api/{labId}/borrows`
24. `POST /api/{labId}/borrows/:id/return`
25. `POST /api/{labId}/borrows/:id/signature/:role`
26. Extension request + approve/reject
27. `POST /api/{labId}/incident-reports`
28. `GET /api/{labId}/borrows/:id/print`, `/pdf`

**Phase 5 — Reservations & calendar**
29. `POST /api/{labId}/reservations` + conflict detection inside lock
30. Approval endpoints (instructor + manager)
31. `POST /api/{labId}/reservations/:id/convert-to-borrow`
32. `GET /api/{labId}/reservations/calendar` with role filter
33. No-show + stale-pending watchdog crons; penalty escalation cron
34. Calendar page + approval drawer

**Phase 6 — Alerts, labels, notifications**
35. Overdue cron + penalty escalation + `GET /api/{labId}/alerts`
36. Low-stock cron
37. `POST /api/{labId}/alerts/:id/acknowledge`
38. Label generation (all formats)
39. Email notifications; Web Push optional

**Phase 7 — UI**
40. Dashboard (overdue, pending approvals, low stock, pending extensions)
41. Inventory list, item detail, unit list/detail
42. Kit browser + borrow-via-kit flow
43. Borrow creation (Scanner → NFC → unit picker → signature → confirm)
44. Return page (per-line settle + incident capture)
45. Reservation forms + approval queue
46. User + membership management
47. Location diagram

**Phase 8 — Search, PWA, audit, misc**
48. Asset fetch cron + manual fetch endpoint
49. `lunr.js` index builder + `CatalogSearch.tsx`
50. Public catalog page
51. Bulk CSV import endpoint
52. PII redaction cron
53. Audit log explorer (admin) with HMAC chain verifier
54. PWA manifest + service worker

---

## Security checklist (verify before go-live)

- [ ] `JWT_SECRET`, `PRINT_TOKEN_SECRET`, `AUDIT_HMAC_SECRET` are 32+ random chars, never the example values
- [ ] `.env` and `src/data/` and `data/` are in `.gitignore`
- [ ] All mutation API routes use `withAuth()` — zero unprotected write endpoints
- [ ] `LAB_REQUIRE_2FA_ADMIN=true` is set; admin login tested to require TOTP
- [ ] All barcode/RFID values pass through `sanitizeCode()` before fs or query use
- [ ] Signature payload max 500 KB enforced client-side (canvas resize) AND server-side (zod)
- [ ] Incident photo uploads: validate MIME type + magic bytes (`file-type` npm), max 5 MB, random filename
- [ ] `proper-lockfile` used on every write; composite locks in canonical alphabetical order
- [ ] Soft-delete everywhere; no hard deletes; no array splices
- [ ] Print token delivered via `Authorization` header or POST body — never query string
- [ ] Caddy CSP active; no `unsafe-eval`; Carbon CDN host is the only external `script-src`
- [ ] Calendar feed filters by role — students cannot see other users' reservation details
- [ ] Audit log opened in append mode only; no rewrite path exists
- [ ] `manager-approve` re-runs `findConflicts()` inside its lock
- [ ] `convert-to-borrow` re-runs `findConflicts()` inside its lock
- [ ] `createBorrow` asserts `0 <= quantity_available <= quantity_total` after every bulk write
- [ ] `recordReturn` refuses `returned_quantity > remaining`
- [ ] PATCH of `tracking_mode` on an item with existing units or borrows returns `409`
- [ ] HMAC chain verification runs on `GET /api/{labId}/audit`; broken chain triggers critical alert
- [ ] Backup cron tested with a full restore drill to a sibling directory
- [ ] `puppeteer` (if used) runs as non-root with a 10-second page timeout

---

## Common pitfalls — and their solutions

### 1. Confusing items with units

**Pitfall:** Reading `items.quantity_available` for a serialized item, or creating unit rows for a bulk item.

**Solution:** `ItemSchema.superRefine()` rejects serialized items with quantity fields and bulk items without them at the API boundary. The `GET /api/{labId}/items/:id` handler computes `available_count` dynamically based on `tracking_mode`: for serialized it counts `units.filter(u => u.status === 'available' && !u.deleted_at).length`; for bulk it reads `quantity_available` directly. Never mix the two code paths without the `tracking_mode` guard.

---

### 2. Race condition on the last unit

**Pitfall:** Two simultaneous borrow requests for the last unit both read `status: "available"`, both write `status: "borrowed"`, and one silently double-books the unit.

**Solution:** `withLocks(['borrows.json', 'items.json', 'reservations.json', 'units.json'], ...)` acquires all file locks in that exact alphabetical order *before* reading anything. The status check and the status write both happen inside the same closure. Never read inventory state before entering the lock and then trust that state inside.

---

### 3. Reservation TOCTOU (time-of-check vs time-of-use)

**Pitfall:** Instructor approves; another reservation consumes the last unit before manager approves. Manager approves based on stale state; `convert-to-borrow` crashes at runtime.

**Solution:** `manager-approve` and `convert-to-borrow` both re-run `findConflicts()` inside their own composite lock. If a conflict is found at manager-approve time, the handler returns `409` with conflict details and suggests the next free slot. Do not cache `findConflicts` results across approval steps.

---

### 4. Bulk return arithmetic error

**Pitfall:** Returning a bulk line increments `quantity_available` by `line.quantity` (original amount borrowed) instead of `ret.returned_quantity` (amount being returned now), creating phantom inventory.

**Solution:** In `recordReturn`, increment `quantity_available` by `ret.returned_quantity` only. After the write, assert `item.quantity_available <= item.quantity_total`. Track `returned_quantity` cumulatively on the line so partial returns are explicit and auditable.

---

### 5. Switching `tracking_mode` after data exists

**Pitfall:** Lab manager PATCHes an item's `tracking_mode` from `bulk` to `serialized`. Existing borrow lines with `unit_id: null` now reference an item that expects `unit_id` everywhere; serialized logic tries to look up units that don't exist.

**Solution:** The PATCH handler reads both `units.json` and `borrows.json`. If any row references the item AND the new `tracking_mode` differs from the current, return `409 Cannot change tracking_mode: existing references exist`. The correct migration path is to create a new item, transfer stock, and retire the old item. Document this in the UI.

---

### 6. Multi-lab data leakage

**Pitfall:** `readDb(ctx.params.labId, 'borrows.json')` is called with `labId` sourced from the URL without verifying the requesting user is a member of that lab.

**Solution:** `withAuth()` always resolves `getMembership(user, labId)` and returns `403` if no membership exists. Every `readDb` call in a handler receives the `labId` that `withAuth` has already validated. Never pass raw URL params to `readDb` without going through `withAuth` first.

---

### 7. Calendar feed PII leakage

**Pitfall:** The calendar endpoint returns all reservations across all users, exposing names, purposes, and course codes to students.

**Solution:**
- `student`: return only their own events (full detail) + per-item availability bars showing only free-unit counts (no user data: `{ resourceId, start, end, title: "2 available", color }`)
- `instructor`: their own events + events where `instructor_id === actor.user_id`
- `manager`/`admin`: all events with full detail

The role filter runs inside `GET /api/{labId}/reservations/calendar` before building the response payload.

---

### 8. Signature canvas size

**Pitfall:** A 300 dpi canvas produces a 2–5 MB PNG, blowing up `borrows.json` and failing the zod max.

**Solution:** Before `toDataURL`, draw the canvas into a fixed-size 600×200 offscreen canvas:

```typescript
const offscreen = document.createElement('canvas');
offscreen.width = 600; offscreen.height = 200;
offscreen.getContext('2d')!.drawImage(canvasRef.current!, 0, 0, 600, 200);
const data = offscreen.toDataURL('image/png');
if (data.length > 500_000) { alert('Signature too large. Please sign again.'); return; }
```

The server enforces the same cap via `SignatureSchema.max(500_000)`.

---

### 9. iOS NFC / Web NFC unavailability

**Pitfall:** The borrow form calls `new NDEFReader()` unconditionally; the page throws on iOS Safari and desktop Chrome, breaking the borrow flow entirely.

**Solution:** Check `'NDEFReader' in window` at runtime. Render the manual RFID text input when the API is unavailable. Test the manual path on every borrow form iteration — it is the primary path for the majority of platforms.

---

### 10. Timezone mismatch on reservation windows

**Pitfall:** The client submits `start_at: "2026-06-01T09:00"` without a timezone offset. Node parses it as UTC (which is wrong for users in Istanbul, GMT+3).

**Solution:** The reservation form always converts the local picker value to a full UTC ISO string before submission:

```typescript
const start_at = new Date(localPickerValue).toISOString(); // → "2026-06-01T06:00:00.000Z"
```

Store all timestamps as UTC. Display in local timezone with `Intl.DateTimeFormat(undefined, { timeZone: LAB_TIMEZONE })` on the client only.

---

### 11. Print token in proxy logs

**Pitfall:** `GET /api/{labId}/borrows/:id/print?token=abc123` — the token lands in Caddy's access log, which may be shipped to a log aggregator.

**Solution:** Deliver the print token via `Authorization: Bearer <token>` header or a small POST body. The Astro route reads `ctx.request.headers.get('authorization')`, not `ctx.url.searchParams`. The Caddy access log never captures request headers or bodies by default.

---

### 12. Audit log tampering

**Pitfall:** A filesystem edit to `audit_log.json` silently removes a borrow event.

**Solution:** The HMAC chain links every entry to the previous one. `GET /api/{labId}/audit` re-verifies all HMACs on read and returns `chain_valid: false` if any entry has been tampered with. A broken chain triggers a `critical` alert immediately. The audit file is opened in append mode only; no code path in the application rewrites it.

---

### 13. JSON file scalability

**Pitfall:** At ~10 000 borrow records, `readFileSync` + `JSON.parse` on every request takes 80–200 ms even with the cache, because cache invalidation on every write causes a re-parse stampede under concurrent load.

**Short-term solution:** The `mtime`-keyed in-memory cache absorbs the majority of reads. Under a single pm2 process with normal lab traffic (< 50 concurrent users), this is adequate through ~5 000 records per file.

**Migration path when the lab grows past ~5 000 active records:** Swap `db.ts` to use `better-sqlite3`. The schema is intentionally relational; translation is a mechanical lift. Because all route handlers use `readDb`/`commit` and never call `fs` or SQL directly, no route code changes. Add a `schema_version` check in `migrations/runner.ts` to trigger the SQLite bootstrap migration automatically.

Do not shard JSON files by date or prefix — it complicates locking and partially delays rather than solving the issue.