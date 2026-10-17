import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------
const LineSchema = z.object({
  item_id: z.uuid(),
  unit_id: z.uuid().nullable(),
  quantity: z.number().int().min(1),
  is_accessory: z.boolean().default(false),
  is_required: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
  totp_token: z.string().length(6).optional(),
});

export const TotpVerifySchema = z.object({
  token: z.string().length(6),
});

// ---------------------------------------------------------------------------
// Users / labs
// ---------------------------------------------------------------------------
export const CreateUserSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  rfid_tag: z.string().max(60).optional(),
});

export const LabSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(200),
  room: z.string().max(100).optional(),
  contact_email: z.string().email().optional(),
});

export const MembershipSchema = z.object({
  user_id: z.uuid(),
  role: z.enum(['admin', 'manager', 'technician', 'instructor', 'student', 'viewer']),
  user_type: z.enum(['student', 'staff', 'faculty', 'external']),
  student_level: z.number().int().min(0).max(10).default(0),
  instructor_ids: z.array(z.uuid()).default([]),
});

export const UserPatchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  rfid_tag: z.string().max(60).nullable().optional(),
  is_active: z.boolean().optional(),
  must_change_password: z.boolean().optional(),
});

export const PasswordChangeSchema = z.object({
  old_password: z.string().min(1),
  new_password: z.string().min(8).max(200),
});

export const MembershipPatchSchema = z.object({
  role: z.enum(['admin', 'manager', 'technician', 'instructor', 'student', 'viewer']).optional(),
  user_type: z.enum(['student', 'staff', 'faculty', 'external']).optional(),
  student_level: z.number().int().min(0).max(10).optional(),
  instructor_ids: z.array(z.uuid()).optional(),
  is_active: z.boolean().optional(),
  borrow_restricted_until: z.string().datetime().nullable().optional(),
});

export const AuthorizationSchema = z.object({
  student_id: z.uuid(),
  instructor_id: z.uuid(),
  item_category: z.string().min(1).max(100),
  expires_at: z.string().datetime(),
  is_active: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------
export const ItemSchema = z
  .object({
    sku: z.string().max(60).optional(),
    name: z.string().min(1).max(200),
    category: z.string().min(1),
    brand: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    tracking_mode: z.enum(['serialized', 'bulk']),
    quantity_total: z.number().int().min(1).nullable(),
    quantity_available: z.number().int().min(0).nullable(),
    min_stock_alert: z.number().int().min(0).nullable(),
    owner_id: z.uuid().optional(),
    default_location_id: z.uuid().optional(),
    availability_rule_id: z.uuid().optional(),
    label_size: z.enum(['standard', 'card']).default('standard'),
    description: z.string().max(5000).nullable().optional(),
    photo_url: z.string().url().nullable().optional(),
    official_page_url: z.string().url().nullable().optional(),
    included_accessories: z.array(z.string().max(200)).optional(),
    notes: z.string().max(2000).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.tracking_mode === 'serialized') {
      if (v.quantity_total !== null || v.quantity_available !== null) {
        ctx.addIssue({
          code: 'custom',
          message: 'Serialized items must not carry quantity fields',
        });
      }
    } else {
      if (v.quantity_total === null || v.quantity_available === null) {
        ctx.addIssue({
          code: 'custom',
          message: 'Bulk items must have quantity_total and quantity_available',
        });
      } else if (v.quantity_available > v.quantity_total) {
        ctx.addIssue({
          code: 'custom',
          message: 'quantity_available cannot exceed quantity_total',
        });
      }
    }
  });

export const UnitSchema = z.object({
  item_id: z.uuid(),
  serial_number: z.string().max(120).optional(),
  asset_tag: z.string().max(60).optional(),
  condition: z.enum(['new', 'good', 'fair', 'damaged']).default('good'),
  location_id: z.uuid().optional(),
  purchase_date: z.string().datetime().optional(),
  purchase_price: z.number().nonnegative().optional(),
  warranty_until: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

export const ItemPatchSchema = z.object({
  sku: z.string().max(60).nullable().optional(),
  name: z.string().min(1).max(200).optional(),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  tracking_mode: z.enum(['serialized', 'bulk']).optional(),
  quantity_total: z.number().int().min(1).nullable().optional(),
  quantity_available: z.number().int().min(0).nullable().optional(),
  min_stock_alert: z.number().int().min(0).nullable().optional(),
  owner_id: z.uuid().nullable().optional(),
  default_location_id: z.uuid().nullable().optional(),
  availability_rule_id: z.uuid().nullable().optional(),
  datasheet_url: z.string().url().nullable().optional(),
  tutorial_links: z.array(z.string().url()).optional(),
  label_size: z.enum(['standard', 'card']).optional(),
  description: z.string().max(5000).nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  official_page_url: z.string().url().nullable().optional(),
  included_accessories: z.array(z.string().max(200)).optional(),
  notes: z.string().max(2000).optional(),
});

export const UnitPatchSchema = z.object({
  serial_number: z.string().max(120).nullable().optional(),
  asset_tag: z.string().max(60).nullable().optional(),
  status: z.enum(['available', 'borrowed', 'reserved', 'maintenance', 'retired', 'lost']).optional(),
  condition: z.enum(['new', 'good', 'fair', 'damaged']).optional(),
  location_id: z.uuid().nullable().optional(),
  purchase_date: z.string().datetime().nullable().optional(),
  purchase_price: z.number().nonnegative().nullable().optional(),
  warranty_until: z.string().datetime().nullable().optional(),
  notes: z.string().max(2000).optional(),
});

// ---------------------------------------------------------------------------
// Borrows
// ---------------------------------------------------------------------------
export const BorrowSchema = z.object({
  user_id: z.uuid(),
  reservation_id: z.uuid().optional(),
  kit_id: z.uuid().optional(),
  due_date: z.string().datetime(),
  lines: z.array(LineSchema).min(1).max(50),
  notes: z.string().max(2000).optional(),
});

export const ReturnSchema = z.object({
  lines: z
    .array(
      z.object({
        line_id: z.uuid(),
        returned_quantity: z.number().int().min(0),
        returned_condition: z.enum(['new', 'good', 'fair', 'damaged']).optional(),
        has_incident: z.boolean().default(false),
      }),
    )
    .min(1),
  return_sig_data: z
    .string()
    .startsWith('data:image/png;base64,')
    .max(500_000)
    .optional(),
  notes: z.string().max(2000).optional(),
});

export const ExtensionRequestSchema = z.object({
  requested_due_date: z.string().datetime(),
  reason: z.string().min(3).max(1000),
});

export const SignatureSchema = z.object({
  sig_data: z.string().startsWith('data:image/png;base64,').max(500_000),
});

// ---------------------------------------------------------------------------
// Reservations
// ---------------------------------------------------------------------------
export const ReservationSchema = z
  .object({
    user_id: z.uuid(),
    instructor_id: z.uuid().nullable(),
    kit_id: z.uuid().nullable().optional(),
    start_at: z.string().datetime(),
    end_at: z.string().datetime(),
    purpose: z.string().min(3).max(500),
    course_code: z.string().max(40).optional(),
    lines: z.array(LineSchema).min(1).max(50),
  })
  .refine((v) => new Date(v.end_at) > new Date(v.start_at), {
    message: 'end_at must be after start_at',
  });

// ---------------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------------
export const IncidentReportSchema = z.object({
  borrow_id: z.uuid(),
  borrow_line_id: z.uuid(),
  unit_id: z.uuid().nullable().optional(),
  item_id: z.uuid(),
  kind: z.enum(['damage', 'loss', 'missing_part', 'malfunction', 'misuse']),
  severity: z.enum(['minor', 'major', 'total_loss']),
  description: z.string().min(3).max(2000),
});

// ---------------------------------------------------------------------------
// Kits
// ---------------------------------------------------------------------------
export const KitSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  availability_rule_id: z.uuid().nullable().optional(),
  lines: z
    .array(
      z.object({
        item_id: z.uuid(),
        quantity: z.number().int().min(1),
        is_required: z.boolean().default(true),
      }),
    )
    .min(1)
    .max(50),
});

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------
export const LocationSchema = z.object({
  name: z.string().min(1).max(200),
  room: z.string().max(100).optional(),
  shelf: z.string().max(100).nullable().optional(),
  notes: z.string().max(2000).optional(),
});

// ---------------------------------------------------------------------------
// Item Accessories
// ---------------------------------------------------------------------------
export const AccessorySchema = z.object({
  accessory_item_id: z.uuid(),
  relation_type: z.enum([
    'required_accessory',
    'optional_accessory',
    'included_in_kit',
    'compatible_with',
  ]),
  is_required: z.boolean().default(false),
  quantity_required: z.number().int().min(1).default(1),
});

// ---------------------------------------------------------------------------
// sanitizeCode — use on every barcode/RFID value before fs or query use
// ---------------------------------------------------------------------------
export function sanitizeCode(raw: string): string {
  return raw.replace(/[^A-Za-z0-9:\-]/g, '').slice(0, 60);
}

// ---------------------------------------------------------------------------
// Helper: parse request body and validate with a Zod schema
// ---------------------------------------------------------------------------
export async function parseBody<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<{ data: T } | { error: Response }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      error: new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      error: new Response(
        JSON.stringify({ error: 'Validation failed', issues: result.error.issues }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      ),
    };
  }
  return { data: result.data };
}
