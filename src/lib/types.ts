export type Role = 'admin' | 'manager' | 'technician' | 'instructor' | 'student' | 'viewer';
export type UserType = 'student' | 'staff' | 'faculty' | 'external';

export interface LabMembershipToken {
  lab_id: string;
  lab_slug: string;
  role: Role;
  user_type: UserType;
}

export interface JwtPayload {
  user_id: string;
  email: string;
  memberships: LabMembershipToken[];
  totp_verified: boolean;
  partial?: boolean;
  iat?: number;
  exp?: number;
}

export interface Lab {
  id: string;
  slug: string;
  name: string;
  room: string;
  contact_email: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  rfid_tag: string | null;
  name: string;
  email: string;
  password_hash: string;
  must_change_password: boolean;
  totp_secret_enc: string | null;
  totp_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  redacted_at: string | null;
}

export interface LabMembership {
  id: string;
  user_id: string;
  lab_id: string;
  role: Role;
  user_type: UserType;
  student_level: number;
  instructor_ids: string[];
  no_show_count: number;
  borrow_restricted_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Item {
  id: string;
  lab_id: string;
  sku: string | null;
  barcode: string;
  qr_code: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  tracking_mode: 'serialized' | 'bulk';
  quantity_total: number | null;
  quantity_available: number | null;
  min_stock_alert: number | null;
  owner_id: string | null;
  default_location_id: string | null;
  availability_rule_id: string | null;
  description: string | null;
  photo_url: string | null;
  image_path: string | null;
  official_page_url: string | null;
  datasheet_url: string | null;
  tutorial_links: string[];
  included_accessories: string[];
  manual_file_ids: string[];
  label_size: 'standard' | 'card';
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Unit {
  id: string;
  lab_id: string;
  item_id: string;
  barcode: string;
  qr_code: string;
  serial_number: string | null;
  asset_tag: string | null;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'retired' | 'lost';
  condition: 'new' | 'good' | 'fair' | 'damaged';
  current_borrow_id: string | null;
  location_id: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  warranty_until: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ItemAccessory {
  id: string;
  lab_id: string;
  parent_item_id: string;
  accessory_item_id: string;
  relation_type: 'required_accessory' | 'optional_accessory' | 'included_in_kit' | 'compatible_with';
  is_required: boolean;
  quantity_required: number;
  deleted_at?: string | null;
}

export interface KitLine {
  item_id: string;
  quantity: number;
  is_required: boolean;
}

export interface Kit {
  id: string;
  lab_id: string;
  name: string;
  version: number;
  description: string;
  availability_rule_id: string | null;
  lines: KitLine[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BorrowLine {
  id: string;
  item_id: string;
  unit_id: string | null;
  quantity: number;
  is_accessory: boolean;
  is_required: boolean;
  borrowed_condition: string | null;
  returned_condition: string | null;
  returned_quantity: number;
  returned_at: string | null;
  incident_report_id: string | null;
}

export interface BorrowRecord {
  id: string;
  lab_id: string;
  user_id: string;
  reservation_id: string | null;
  kit_id: string | null;
  lines: BorrowLine[];
  borrowed_at: string;
  due_date: string;
  max_due_date: string;
  returned_at: string | null;
  status: 'active' | 'partially_returned' | 'returned' | 'overdue' | 'cancelled';
  approved_by: string | null;
  instructor_auth_id: string | null;
  borrower_sig_data: string | null;
  technician_sig_data: string | null;
  return_sig_data: string | null;
  print_token: string;
  penalty_level: 0 | 1 | 2;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BorrowExtension {
  id: string;
  lab_id: string;
  borrow_id: string;
  requested_by: string;
  requested_due_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string;
  created_at: string;
}

export interface IncidentReport {
  id: string;
  lab_id: string;
  borrow_id: string;
  borrow_line_id: string;
  unit_id: string | null;
  item_id: string;
  kind: 'damage' | 'loss' | 'missing_part' | 'malfunction' | 'misuse';
  severity: 'minor' | 'major' | 'total_loss';
  description: string;
  photo_paths: string[];
  reported_by: string;
  reported_at: string;
  resolved_at: string | null;
  resolution_notes: string;
}

export interface ReservationLine {
  id: string;
  item_id: string;
  unit_id: string | null;
  quantity: number;
}

export interface Reservation {
  id: string;
  lab_id: string;
  user_id: string;
  kit_id: string | null;
  lines: ReservationLine[];
  start_at: string;
  end_at: string;
  purpose: string;
  course_code: string;
  status:
    | 'draft'
    | 'pending_instructor'
    | 'pending_manager'
    | 'approved'
    | 'active'
    | 'completed'
    | 'rejected'
    | 'cancelled'
    | 'expired';
  instructor_id: string | null;
  instructor_decision_at: string | null;
  instructor_notes: string;
  manager_decision_by: string | null;
  manager_decision_at: string | null;
  manager_notes: string;
  rejection_reason: string;
  borrow_id: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
}

export type AlertKind =
  | 'overdue'
  | 'low_stock'
  | 'pending_approval'
  | 'no_show'
  | 'incident_open'
  | 'warranty_expiring'
  | 'extension_requested';

export type AlertSeverity = 'info' | 'warning' | 'overdue' | 'critical';

export interface Alert {
  id: string;
  lab_id: string;
  kind: AlertKind;
  borrow_id: string | null;
  reservation_id: string | null;
  item_id: string | null;
  user_id: string | null;
  message: string;
  triggered_at: string;
  resolved_at: string | null;
  severity: AlertSeverity;
  acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
}

export interface AuditEntry {
  id: string;
  ts: string;
  lab_id: string | null;
  actor_id: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  request_id?: string;
  ip?: string;
  user_agent?: string;
  hmac: string;
}

export interface Config {
  lab_id: string;
  schema_version: number;
  pending_ttl_hours: number;
  no_show_grace_minutes: number;
  no_show_restriction_threshold: number;
  no_show_restriction_days: number;
  max_advance_booking_days: number;
  min_lead_time_minutes_student: number;
  min_lead_time_minutes_staff: number;
  default_max_borrow_days: number;
  penalty_warning_days_overdue: number;
  penalty_suspension_days_overdue: number;
  penalty_suspension_duration_days: number;
  low_stock_check_cron: string;
  require_return_signature: boolean;
}

export interface AvailabilityRule {
  id: string;
  lab_id: string;
  name: string;
  allowed_user_types: UserType[];
  min_student_level: number;
  requires_instructor_auth: boolean;
  max_borrow_days: number;
  max_concurrent: number;
  advance_booking_days: number;
}

export interface MediaAsset {
  id: string;
  lab_id: string;
  item_id: string;
  kind: 'photo' | 'datasheet' | 'manual' | 'tutorial';
  url: string;
  local_path: string | null;
  mime_type: string | null;
  file_size: number | null;
  fetched_at: string | null;
  fetch_error: string | null;
  created_at: string;
}

export interface Authorization {
  id: string;
  lab_id: string;
  student_id: string;
  instructor_id: string;
  item_category: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export interface Owner {
  id: string;
  lab_id: string;
  name: string;
  contact_email: string | null;
  notes: string;
}

export interface Location {
  id: string;
  lab_id: string;
  name: string;
  room: string;
  shelf: string | null;
  notes: string;
  created_at: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
