/**
 * Auth helper for Astro page frontmatter.
 * Input:  token cookie value, optional lab slug
 * Output: { redirect } | { user, membership?, lab? }
 */
import { verifyToken } from './auth.js';
import { readDb } from './db.js';
import type { JwtPayload, LabMembershipToken, Lab } from './types.js';

export type PageAuthOk = { user: JwtPayload; membership?: LabMembershipToken; lab?: Lab };
export type PageAuthResult = { redirect: string } | PageAuthOk;

export async function requirePage(
  token: string | undefined,
  labSlug?: string,
): Promise<PageAuthResult> {
  if (!token) return { redirect: '/login' };
  let user: JwtPayload;
  try {
    user = await verifyToken(token);
  } catch {
    return { redirect: '/login' };
  }
  if (user.partial) return { redirect: '/login' };
  if (!labSlug) return { user };

  const membership = user.memberships.find((m) => m.lab_slug === labSlug);
  if (!membership) return { redirect: '/' };

  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.slug === labSlug);
  if (!lab || !lab.is_active) return { redirect: '/' };

  return { user, membership, lab };
}

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
