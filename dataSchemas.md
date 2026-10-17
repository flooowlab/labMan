## Multi-lab tenancy

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

## Data schemas

### Inventory model: items vs units

| `tracking_mode` | When to use | Quantity model | Barcode scope |
|---|---|---|---|
| `serialized` | High-value, repairable, must trace history | Count of `units` where `status === "available"` | One barcode **per unit** |
| `bulk` | Low-cost, fungible (cables, resistors, batteries) | `quantity_available` counter on item | One barcode **per item** |

Switching `tracking_mode` after units or borrows reference an item is **forbidden** — PATCH handler returns `409`. The migration path when change is genuinely needed: create a new item with the target mode, transfer stock, retire the old item. Document this in the UI rather than allowing the PATCH.

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
  "description": "Ideal for portrait, wedding, and studio photography. Shoots 8K RAW video.",
  "photo_url": "https://example.com/images/canon-eos-r5.jpg",
  "official_page_url": "https://www.canon.com/cameras/eos-r5",
  "included_accessories": ["Battery pack LP-E6NH", "Battery charger LC-E6", "USB-C cable"],
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
- `GET /api/{labId}/items/:id` computes `available_count` dynamically: for `serialized`, count `units` where `status === "available" && !deleted_at`; for `bulk`, read `quantity_available` directly. Always branch on `tracking_mode` — never mix the two code paths.

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
- **Return arithmetic**: `recordReturn` increments `quantity_available` by `ret.returned_quantity` (what is being returned now), **not** `line.quantity` (the original borrow amount). Track `returned_quantity` cumulatively on the line so partial returns are explicit and auditable. After every write assert `quantity_available <= quantity_total`.

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

**Timezone rule:** All timestamps are stored as UTC. The reservation form must convert the local datetime-picker value before submission: `const start_at = new Date(localPickerValue).toISOString()`. Display in local timezone client-side only via `Intl.DateTimeFormat`.

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