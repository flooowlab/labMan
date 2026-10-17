/** Client-safe utility helpers (no server imports). */

/** Returns badge CSS class for a given status string. */
export function statusClass(s: string): string {
  const map: Record<string, string> = {
    active: 'badge-green', available: 'badge-green', approved: 'badge-green',
    good: 'badge-green', new: 'badge-blue', completed: 'badge-green',
    overdue: 'badge-red', lost: 'badge-red', damaged: 'badge-red', rejected: 'badge-red',
    borrowed: 'badge-yellow', reserved: 'badge-yellow', fair: 'badge-yellow',
    partially_returned: 'badge-yellow', maintenance: 'badge-yellow',
    pending_instructor: 'badge-blue', pending_manager: 'badge-blue',
    returned: 'badge-blue',
    cancelled: 'badge-gray', expired: 'badge-gray', retired: 'badge-gray',
  };
  return `badge ${map[s] ?? 'badge-gray'}`;
}

/** Short date string from ISO timestamp. */
export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';
