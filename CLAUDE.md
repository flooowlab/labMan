# CLAUDE.md — Lab Management System

---

## Build & run

```bash
npm install
npm run dev                                       # hot reload (vite dev)
npm run build
node build/index.js                               # production

npx tsx scripts/seed.ts                           # first run: super-admin + first lab
npx tsx scripts/fetch-assets.ts <lab-id>          # initial asset population
npx tsx scripts/check-overdue.ts <lab-id>         # manual overdue sweep
npx tsx scripts/redact-pii.ts                     # PII redaction (run via cron)
# Bulk CSV import: POST /api/{labId}/items/bulk-import (multipart/form-data, manager+)
```

## Production Development Guide

This file is the authoritative reference for building the lab management system. Read it entirely before writing any code. Update it when architectural decisions change.

All design decisions have been resolved and are documented inline in their relevant sections below. Do not change any behaviour noted here without a written decision from the lab director.

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
| Meta-framework | SvelteKit 2 (SSR, Node adapter) | File-based routing, API routes, Svelte components |
| UI components | Svelte 5 | Reactive components; SSR-first; runes API (`$state`, `$derived`, `$effect`) |
| Design system | Custom CSS (`src/styles/app.css`) | Carbon removed; all colors/fonts as CSS vars at top of `app.css` |
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
├── svelte.config.js
├── vite.config.ts
├── package.json
├── caddy/Caddyfile
├── migrations/
│   ├── runner.ts              ← boot-time migration runner
│   └── 0001-initial-schema.ts
├── scripts/
│   ├── fetch-assets.ts
│   ├── check-overdue.ts
│   ├── seed.ts                ← create first admin + lab
│   └── redact-pii.ts
├── src/
│   ├── app.html                           ← root HTML shell (replaces Astro default wrapper)
│   ├── hooks.server.ts                    ← SvelteKit handle hook; awaits bootMigrations()
│   ├── routes/                            ← replaces src/pages/
│   │   ├── +layout.svelte                 ← minimal root layout (no auth)
│   │   ├── +page.svelte                   ← public landing: catalog redirect (1 lab) or lab directory
│   │   ├── login/
│   │   │   └── +page.svelte
│   │   ├── [lab]/                         ← all pages scoped to a lab slug
│   │   │   ├── +layout.svelte             ← Shell layout: nav, header, logout; loads auth from +layout.server.ts
│   │   │   ├── +layout.server.ts          ← auth redirect guard for all lab pages
│   │   │   ├── +page.svelte               ← dashboard
│   │   │   ├── +page.server.ts            ← load() fetches borrows, reservations, alerts
│   │   │   ├── catalog/
│   │   │   │   ├── +page.svelte           ← public gallery + login card sidebar (no auth required)
│   │   │   │   ├── +page.server.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte       ← public item detail: description, tutorials, borrow CTA
│   │   │   │       └── +page.server.ts
│   │   │   ├── inventory/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── +page.server.ts
│   │   │   │   ├── new/
│   │   │   │   │   └── +page.svelte
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte       ← detail + inline units list
│   │   │   │       ├── +page.server.ts
│   │   │   │       ├── edit/
│   │   │   │       │   ├── +page.svelte
│   │   │   │       │   └── +page.server.ts
│   │   │   │       └── units/new/
│   │   │   │           └── +page.svelte
│   │   │   ├── kits/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── +page.server.ts
│   │   │   │   ├── new/+page.svelte
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte
│   │   │   │       └── +page.server.ts
│   │   │   ├── users/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── +page.server.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte
│   │   │   │       └── +page.server.ts
│   │   │   ├── borrows/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── +page.server.ts
│   │   │   │   ├── new/+page.svelte
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte
│   │   │   │       ├── +page.server.ts
│   │   │   │       └── return/+page.svelte
│   │   │   ├── reservations/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── +page.server.ts
│   │   │   │   ├── new/+page.svelte
│   │   │   │   ├── pending/+page.svelte
│   │   │   │   ├── calendar/+page.svelte
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte
│   │   │   │       └── +page.server.ts
│   │   │   ├── locations/
│   │   │   │   ├── +page.svelte
│   │   │   │   └── diagram/+page.svelte
│   │   │   └── audit/
│   │   │       ├── +page.svelte
│   │   │       └── +page.server.ts
│   │   └── api/
│   │       ├── health/+server.ts
│   │       ├── auth/
│   │       │   ├── login/+server.ts
│   │       │   ├── logout/+server.ts
│   │       │   ├── me/+server.ts
│   │       │   ├── refresh/+server.ts
│   │       │   └── totp/
│   │       │       ├── enroll/+server.ts
│   │       │       └── verify/+server.ts
│   │       ├── labs/
│   │       │   ├── +server.ts
│   │       │   └── [labId]/+server.ts
│   │       └── [labId]/                   ← all data routes scoped to a lab
│   │           ├── items/
│   │           │   ├── +server.ts
│   │           │   ├── [id]/+server.ts
│   │           │   ├── [id]/
│   │           │   │   ├── units/+server.ts
│   │           │   │   ├── accessories/+server.ts
│   │           │   │   ├── assets/fetch/+server.ts
│   │           │   │   ├── availability/+server.ts
│   │           │   │   └── label/+server.ts
│   │           │   ├── barcode/[code]/+server.ts
│   │           │   └── bulk-import/+server.ts
│   │           ├── units/
│   │           │   ├── [id]/+server.ts
│   │           │   └── [id]/label/+server.ts
│   │           ├── kits/
│   │           │   ├── +server.ts
│   │           │   └── [id]/+server.ts
│   │           ├── users/
│   │           │   ├── +server.ts
│   │           │   ├── [id]/+server.ts
│   │           │   ├── [id]/export/+server.ts
│   │           │   └── rfid/[tag]/+server.ts
│   │           ├── borrows/
│   │           │   ├── +server.ts
│   │           │   ├── [id]/+server.ts
│   │           │   └── [id]/
│   │           │       ├── return/+server.ts
│   │           │       ├── signature/[role]/+server.ts
│   │           │       ├── request-extension/+server.ts
│   │           │       ├── approve-extension/+server.ts
│   │           │       ├── reject-extension/+server.ts
│   │           │       ├── print/+server.ts
│   │           │       └── pdf/+server.ts
│   │           ├── incident-reports/
│   │           │   ├── +server.ts
│   │           │   └── [id]/+server.ts
│   │           ├── reservations/
│   │           │   ├── +server.ts
│   │           │   ├── [id]/+server.ts
│   │           │   ├── [id]/
│   │           │   │   ├── instructor-approve/+server.ts
│   │           │   │   ├── instructor-reject/+server.ts
│   │           │   │   ├── manager-approve/+server.ts
│   │           │   │   ├── manager-reject/+server.ts
│   │           │   │   └── convert-to-borrow/+server.ts
│   │           │   └── calendar/+server.ts
│   │           ├── authorizations/
│   │           │   ├── +server.ts
│   │           │   └── [id]/+server.ts
│   │           ├── alerts/
│   │           │   ├── +server.ts
│   │           │   └── [id]/acknowledge/+server.ts
│   │           ├── audit/+server.ts
│   │           └── locations/
│   │               ├── +server.ts
│   │               ├── diagram/+server.ts
│   │               └── [id]/+server.ts
│   ├── components/
│   │   ├── Scanner.svelte
│   │   ├── NfcReader.svelte
│   │   ├── SignaturePad.svelte
│   │   ├── BorrowForm.svelte
│   │   ├── ReturnForm.svelte
│   │   ├── KitPicker.svelte
│   │   ├── LocationDiagram.svelte
│   │   ├── CalendarView.svelte
│   │   ├── OverduePanel.svelte
│   │   ├── PendingApprovalsPanel.svelte
│   │   ├── LabelPreview.svelte
│   │   ├── CatalogSearch.svelte
│   │   └── CatalogGallery.svelte          ← masonry/list gallery with category chips + login card
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
│   │   ├── types.ts
│   │   └── page-auth.ts
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
├── static/                                ← replaces public/
│   ├── manifest.webmanifest
│   ├── sw-register.js
│   └── sw.js
└── data/
    └── {lab-id}/
        ├── assets/{item-id}/
        └── uploads/{incident-id}/
```

---

## Data schemas
Avaiable at (`dataSchemas.md`)

### Multi-lab tenancy

Every data file lives under `src/data/{lab-id}/`. User accounts are global; roles are per-lab via `lab_memberships.json`.
More at (`dataSchemas.md`)

---

## Database layer (`src/lib/db.ts`) ✓

> Implemented. Exports: `readDb`, `withLocks`, `commit`, `appendAudit`, `readAuditLog`, `verifyAuditChain`.
> Audit log stored as NDJSON (one entry per line); never rewritten.

**Rules — violations are bugs:**
- Never call `fs` directly in route handlers. Always use `readDb` / `commit`.
- Every mutation uses `commit()`. No exceptions.
- Lock canonical alphabetical order: `alerts.json` → `borrow_extensions.json` → `borrows.json` → `items.json` → `lab_memberships.json` → `reservations.json` → `units.json` → `users.json`.
- Run conflict detection *inside* the lock, never before. Never read inventory state before entering the lock and then trust that state inside.
- Soft-delete only: set `deleted_at`. Never splice records.
- Filter `deleted_at !== null` in all list reads.
- After every bulk item write, assert `0 <= quantity_available <= quantity_total`.
- **Data retention:** Never delete records. Redact PII fields (`name`, `email`, `rfid_tag`, `password_hash`) 18 months after the record reaches its final state. Implemented via `scripts/redact-pii.ts`.

**Scalability:** The `mtime`-keyed in-memory cache is adequate for a single pm2 process with < 50 concurrent users through ~5 000 records per file. When any file exceeds ~5 000 active records, swap `db.ts` to `better-sqlite3`. The schema is intentionally relational; the swap is mechanical — no route code changes because handlers never call `fs` or SQL directly. Add a `schema_version` check in `migrations/runner.ts` to trigger the SQLite bootstrap migration. Do not shard JSON files by date or prefix — it complicates locking without solving the problem.

---

## Auth ✓

- `src/lib/auth.ts` — `signToken` / `verifyToken` (jose HS256, 8 h), `getMembership`, `cookieOptions`
- `src/lib/totp.ts` — `generateSecret`, `verifyTotp`, `generateQr`, `encryptSecret`/`decryptSecret` (AES-256-GCM via `TOTP_ENC_KEY`)
- `src/lib/middleware.ts` — `withAuth(handler, {minRole?, anyOf?})`, `err()`, `ok()`
- `src/lib/ratelimit.ts` — token-bucket `rateLimit(key, maxPerMinute)`

TOTP login flow: password check → `partial` JWT → TOTP verify → full JWT. `partial: true` tokens are rejected by `withAuth`.

Apply rate limit at login handler: `rateLimit(\`login:${ip}\`, 5)`.

---

## Validation (`src/lib/validate.ts`) ✓

> Implemented. Exported schemas: `LoginSchema`, `ItemSchema`, `UnitSchema`, `BorrowSchema`, `ReturnSchema`, `ExtensionRequestSchema`, `ReservationSchema`, `SignatureSchema`, `IncidentReportSchema`, `KitSchema`, `LocationSchema`, `CreateUserSchema`, `LabSchema`, `MembershipSchema`, `TotpVerifySchema`. Also exports `sanitizeCode(raw)` and `parseBody(request, schema)`.

---

## Conflict detection (`src/lib/reservations.ts`) ✓

> Implemented. `findConflicts(labId, candidate)` called inside composite lock at `createReservation`, `manager-approve`, and `convert-to-borrow`.

---

## Print token ✓

> Implemented in `src/lib/ids.ts`: `generatePrintToken(borrowId)`, `verifyPrintToken(token, borrowId)`. 1-hour expiry, HMAC-SHA256 signed.

Receive via `Authorization: Bearer <token>` header or POST body — **never** as a query string (avoids proxy log exposure).

---

## Barcode formats & label printing ✓

> Implemented. Barcode format: `LAB-{YEAR}-I-{5-digit}` (item) / `LAB-{YEAR}-U-{5-digit}` (unit). `I`/`U` discriminator dispatches barcode lookups without scanning both files. Label HTML rendered by `src/lib/label.ts`; served via `GET /api/{labId}/items/:id/label` and `GET /api/{labId}/units/:id/label`.

---

## Signature capture — `SignaturePad.svelte` ✓

> Deferred: use `signature_pad` npm package. Install when needed. Downsample to 600×200 offscreen canvas, enforce `data.length <= 500_000` client-side before upload. Server enforces same cap via `SignatureSchema.max(500_000)`.

Before calling `toDataURL`, always redraw into a fixed-size offscreen canvas to prevent high-DPI canvases from producing 2–5 MB payloads:

```typescript
const offscreen = document.createElement('canvas');
offscreen.width = 600; offscreen.height = 200;
offscreen.getContext('2d')!.drawImage(canvasRef.current!, 0, 0, 600, 200);
const data = offscreen.toDataURL('image/png');
if (data.length > 500_000) { alert('Signature too large. Please sign again.'); return; }
```

---

## NFC reader — `NfcReader.svelte` ✓

> `'NDEFReader' in window` guard required. Always render manual RFID text input fallback (primary path for iOS/desktop). BorrowForm implements the manual fallback; NFC path deferred.

---

## Schema migrations ✓

> `migrations/runner.ts` — `runMigrations(labId)`, `bootMigrations()` (singleton promise, runs once at module load).
> `migrations/0001-initial-schema.ts` — creates all per-lab JSON files.
> `src/hooks.server.ts` — SvelteKit `handle` hook that `await`s `bootMigrations()` before every request.

To add a migration: append `{ version: N, up: async (labId) => {...} }` to the MIGRATIONS array. Never edit existing entries.

---

## Environment variables ✓

> See `.env.example`. Key vars: `JWT_SECRET`, `PRINT_TOKEN_SECRET`, `AUDIT_HMAC_SECRET` (each min 32 chars), `TOTP_ENC_KEY` (64 hex chars), `DATA_DIR` (default `./src/data`).

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
    Content-Security-Policy "default-src 'self'; img-src 'self' https: data: blob:; style-src 'self' https://1.www.s81c.com 'unsafe-inline'; font-src 'self' https://1.www.s81c.com; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  }
}
```

---

## Implementation order

**Phase 1 — Foundation ✓**
1. ✓ SvelteKit scaffold with Node SSR adapter
2. ✓ `.env.example` + `DATA_DIR` config loading
3. ✓ `src/lib/db.ts` — `readDb` (mtime cache), `withLocks`, `commit`, NDJSON audit log
4. ✓ `migrations/runner.ts` + `src/hooks.server.ts` boot hook
5. ✓ `src/lib/auth.ts` (jose) + `src/lib/middleware.ts` (withAuth)
6. ✓ `src/lib/ratelimit.ts` — token bucket
7. ✓ `src/lib/validate.ts` — all zod schemas + `sanitizeCode` + `parseBody`
8. ✓ `GET /api/health` + `src/lib/totp.ts`
9. ✓ `scripts/seed.ts` — interactive, creates super-admin + first lab

**Phase 2 — Core inventory ✓**
10. ✓ Items CRUD (`src/routes/api/[labId]/items/`) + barcode/QR gen (`src/lib/barcode.ts`, `src/lib/ids.ts`)
11. ✓ Units CRUD (`src/routes/api/[labId]/items/[id]/units/+server.ts`, `src/routes/api/[labId]/units/[id]/+server.ts`)
12. ✓ `PATCH` guards `tracking_mode` switch (409 if units or borrows reference item)
13. ✓ `DELETE` refuses if active borrows exist; soft-delete only
14. ✓ `GET /api/{labId}/items/barcode/:code` — `I`/`U` discriminator dispatch
15. ✓ `GET /api/{labId}/items/:id/availability` — status breakdown (window calc added in Phase 5)
16. ✓ Kit CRUD (`src/pages/api/[labId]/kits/`) + `expandKit()` in `src/lib/kits.ts`

**Phase 3 — Users, memberships, authorizations ✓**
18. ✓ User + membership CRUD (`src/routes/api/[labId]/users/`, `src/routes/api/labs/`)
19. ✓ `GET /api/{labId}/users/rfid/:tag` — decodes URI + normalises tag to uppercase via `sanitizeCode`
20. ✓ Instructor authorization grant/revoke (`src/routes/api/[labId]/authorizations/`)
21. ✓ Password reset + TOTP enroll/verify (`src/routes/api/auth/totp/`)
22. ✓ `GET /api/{labId}/users/:id/export`

**Phase 4 — Borrow transaction ✓**
23. ✓ `POST /api/{labId}/borrows` + `GET` (list) + `GET /:id`
24. ✓ `POST /api/{labId}/borrows/:id/return`
25. ✓ `POST /api/{labId}/borrows/:id/signature/:role`
26. ✓ Extension request + approve/reject (`request-extension`, `approve-extension`, `reject-extension`)
27. ✓ `POST /api/{labId}/incident-reports` + `GET` (list + detail) + `PATCH` (resolve)
28. ✓ `GET /api/{labId}/borrows/:id/print`, `/pdf` (print-token gated, no withAuth)
   — `src/lib/eligibility.ts` + `src/lib/print.ts` created

**Phase 5 — Reservations & calendar ✓**
29. ✓ `POST /api/{labId}/reservations` + conflict detection inside lock
30. ✓ Approval endpoints (instructor + manager)
31. ✓ `POST /api/{labId}/reservations/:id/convert-to-borrow`
32. ✓ `GET /api/{labId}/reservations/calendar` with role filter
33. ✓ No-show + stale-pending watchdog crons; penalty escalation cron (`scripts/check-overdue.ts`)
34. ✓ Calendar UI (FullCalendar resource-timeline, `CalendarView.svelte`, `[lab]/reservations/calendar/+page.svelte`)

**Phase 6 — Alerts, labels, notifications ✓**
35. ✓ Overdue cron + penalty escalation + `GET /api/{labId}/alerts`
36. ✓ Low-stock cron
37. ✓ `POST /api/{labId}/alerts/:id/acknowledge`
38. ✓ Label generation (`src/lib/label.ts`, items/:id/label, units/:id/label)
39. ✓ Email notifications (nodemailer, graceful skip if SMTP unconfigured)

**Phase 7 — UI ✓**
40. ✓ Dashboard (overdue, pending approvals, low stock, pending extensions)
41. ✓ Inventory list, item detail + inline units list (`[id].astro`); no separate unit detail page
42. ✓ Inventory edit page (`[lab]/inventory/[id]/edit/+page.svelte` — manager+, PATCH item)
43. ✓ Add unit page (`[lab]/inventory/[id]/units/new/+page.svelte` — technician+)
44. ✓ Borrow creation — `BorrowForm.svelte` with user name search + RFID lookup + category/name item browse + barcode scan
45. ✓ Return page (per-line settle + incident flag)
46. ✓ Reservation list + approval queue + new reservation form
47. ✓ User + membership management; admin RFID edit on user detail page
48. ✓ Locations CRUD (`GET/POST /api/{labId}/locations`, `PATCH/DELETE /api/{labId}/locations/[id]`) + `[lab]/locations.astro` (manager+)
49. ✓ `GET /api/{labId}/locations/diagram` — per-location inventory distribution (items + units with availability; `viewer`+)
50. ✓ Kit browser + borrow-via-kit flow (`kits/+page.svelte`, `kits/new/+page.svelte`, `kits/[id]/+page.svelte`; `BorrowForm.svelte` accepts `initialLines` prop; `borrows/new/+page.svelte` reads `?kit_id=` query param)
51. ✓ Location floor-plan diagram UI (`LocationDiagram.svelte` + `[lab]/locations/diagram/+page.svelte` — viewer+)

> UI uses Carbon CDN tokens + custom `src/styles/app.css`. All colors/fonts defined as CSS vars at top of that file. Layout: `src/routes/[lab]/+layout.svelte`. Auth helper: `src/lib/page-auth.ts` (`requirePage`, `statusClass`, `fmtDate`). Svelte components: `LoginForm`, `BorrowForm`, `ReturnForm`.

**Phase 8 — Search, PWA, audit, misc ✓**
51. ✓ Asset fetch cron (`scripts/fetch-assets.ts`) + manual fetch endpoint (`POST /api/{labId}/items/:id/assets/fetch`)
52. ✓ `lunr.js` index builder (`src/lib/search.ts`: `toCatalogDocs`, `buildCatalogIndex`) + `CatalogSearch.svelte` (client-side index load + prefix search)
53. ✓ Public catalog page (`src/routes/[lab]/catalog/+page.svelte`) redesigned as a full public gallery:
    - `CatalogGallery.svelte`: masonry (Pinterest-style CSS columns) + list toggle, category filter chips, lunr search
    - Sticky login card sidebar: `LoginForm.svelte` when unauthenticated, dashboard link when logged in, lab info card
    - Root `+page.svelte` is now public-first: unauthenticated visitors redirected to `/{lab}/catalog` (single lab) or shown a public lab directory with catalog links; login no longer required at root
    - `catalog/[id]/+page.svelte`: public item detail page with description/use-case, tutorials list, datasheet link, availability badge, borrow CTA (auth-aware)
54. ✓ Bulk CSV import endpoint (`POST /api/{labId}/items/bulk-import` — inline CSV parser, manager+)
55. ✓ PII redaction cron (`scripts/redact-pii.ts` — 18-month rule, nulls name/email/rfid/password_hash)
56. ✓ Audit log explorer (`src/routes/[lab]/audit/+page.svelte` + `GET /api/{labId}/audit` — admin only, chain_valid badge, pagination, action filter)
57. ✓ PWA manifest (`static/manifest.webmanifest`), service worker (`static/sw.js` — cache-first static, network-only for auth/borrows/reservations/users), SW registration (`static/sw-register.js`), root `+layout.svelte` updated with manifest + SW script tags

**Phase 9 — Complete ✓**
58. ✓ Accessories API (`GET/POST/DELETE /api/{labId}/items/:id/accessories`) + accessories card on item edit page (`AccessorySchema` added to `validate.ts`; `ItemAccessory.deleted_at` added to `types.ts`)
59. ✓ Kit browser UI + borrow-via-kit flow (`kits/+page.svelte`, `kits/new/+page.svelte`, `kits/[id]/+page.svelte`; `BorrowForm.svelte` gains `initialLines`/`kitId` props; `borrows/new/+page.svelte` reads `?kit_id=` and pre-expands lines)
60. ✓ FullCalendar resource-timeline calendar page (`CalendarView.svelte` + `@fullcalendar/core` + `@fullcalendar/resource-timeline` npm packages; `[lab]/reservations/calendar/+page.svelte`; FullCalendar mounted in `onMount` via vanilla JS API; events colour-coded by status; resources = items)
61. ✓ Location inventory diagram UI (`LocationDiagram.svelte` + `[lab]/locations/diagram/+page.svelte`; viewer+; card per location with item availability bars + unit status table; client-side filter)
62. Periodic-service / maintenance schedule cron (manual unit status flip exists; automated scheduling deferred)
**Phase 10 — Svelte/SvelteKit Migration ✓**

Migration from Astro + React to SvelteKit 2 + Svelte 5 is complete. All `src/lib/`, `src/data/`, `migrations/`, and `scripts/` remain untouched.

**Completed:**
- ✓ Package & config: removed Astro/React; added SvelteKit adapter-node; `svelte.config.js`, `vite.config.ts`, `tsconfig.json` updated; `public/` → `static/`
- ✓ `src/hooks.server.ts` — SvelteKit `handle` hook awaiting `bootMigrations()`
- ✓ `src/app.html` — minimal HTML shell
- ✓ All 53 API routes migrated to `src/routes/api/**/+server.ts` (named export convention)
- ✓ Auth-guarded pages under `src/routes/[lab]/(protected)/` with layout guard
- ✓ Public pages: `src/routes/[lab]/catalog/` (no auth)
- ✓ All `.astro` pages converted to `+page.svelte` + `+page.server.ts`
- ✓ All `.tsx` components converted to `.svelte` (Svelte 5 runes)
- ✓ `src/lib/utils.ts` — client-safe helpers (`fmtDate`, `statusClass`) extracted from `page-auth.ts` to avoid pulling Node-only modules into the client bundle
- ✓ `CatalogSearch.tsx` replaced by inline search in `CatalogGallery.svelte`
- ✓ `npm run build` passes; `npm test` (vitest) passes (13/13)

**Key conventions established:**
- Server-only lib files (`db.ts`, `auth.ts`, `middleware.ts`, etc.) must only be imported in `+server.ts`, `+page.server.ts`, and `+layout.server.ts` — never in `.svelte` components
- Client-safe utilities live in `$lib/utils.ts`
- FullCalendar mounted via vanilla `new Calendar(el, opts)` inside `onMount` with dynamic `import()` to avoid SSR errors
- `$components` alias configured in `svelte.config.js` → `src/components`
- Image upload: `POST /api/{labId}/items/{id}/image`; served via `GET /api/{labId}/items/{id}/image`; stored at `data/{labId}/assets/{itemId}/{uuid}.{ext}`
- Caddy `reverse_proxy` port: set `PORT=4321` in `.env` (SvelteKit adapter-node default is 3000)
- **Svelte 5 runes hydration rule**: always `let x = $derived(data.x)` — NEVER `const { x } = $derived(data)` (destructured const causes fatal hydration errors)
- Print token: returned by `+page.server.ts` for borrow detail page; sent in `Authorization: Bearer <token>` header when calling `/print`
- Catalog item page returns `userMembership` from `+page.server.ts` for role-aware CTAs (Borrow / Reserve / Sign in)
- Coordinator name/email derived from the first admin/manager membership in catalog `+page.server.ts`
- `BorrowForm.svelte` accepts `instructors` prop; shows instructor selector when selected user's `user_type === 'student'`
- Users page server load returns `role`, `labId`, `labSlug`; admin-only Register User inline form POSTs to `/api/{labId}/users`
- Inventory page server load returns `role`, `labId`, `labSlug`; manager+ CSV import inline form POSTs multipart to `/api/{labId}/items/bulk-import`
--- 
## TO DO
~~1. Import images instead of only linking them.~~ ✓ Done
~~2. In homepage the sign in is generic for every user (not exclusive to staff).~~ ✓ Done
~~3. "Sign in to Borrow" CTA on catalog item page gave 404.~~ ✓ Fixed — now `/login?next=...` with `encodeURIComponent`
~~4. Tutorial links not visible on item detail page.~~ ✓ Fixed — renders `item.tutorial_links ?? []`
~~5. Catalog item CTA is role-aware~~ ✓ — staff→Borrow, student→Reserve, unauthenticated→Sign in
~~6. Lab info card (catalog sidebar) missing room / coordinator / email.~~ ✓ Fixed — shows 📍 room, 👤 coordinator, ✉️ email
~~7. Dashboard "New Borrow" button was broken (relative href).~~ ✓ Fixed — absolute `/{slug}/borrows/new`
~~8. Create Location form missing from UI.~~ ✓ Fixed — inline form on locations page (manager+ only)
~~9. Borrow detail page had no print button.~~ ✓ Fixed — Print Form button opens print-token-gated HTML in new tab
~~10. Carbon Design System CDN removed.~~ ✓ Done — all styles from `src/styles/app.css`
~~11. Hydration error on every page refresh.~~ ✓ Fixed — `$derived` destructuring with `const` in layout
~~12. Student borrowing requires instructor designation.~~ ✓ Done — `BorrowForm` shows instructor select when user_type === 'student'
~~13. Admin register new users form.~~ ✓ Done — inline form on users page (admin only)
~~14. Manager+ CSV import for inventory.~~ ✓ Done — inline form on inventory page (manager+)

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
- [ ] Caddy CSP active; no `unsafe-eval`; no external CDN sources in `script-src` (Carbon CDN removed)
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