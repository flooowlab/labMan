import type { RequestEvent } from '@sveltejs/kit';
import { verifyToken, getMembership } from './auth.js';
import type { JwtPayload, LabMembershipToken, Role } from './types.js';

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 6,
  manager: 5,
  technician: 4,
  instructor: 3,
  student: 2,
  viewer: 1,
};

export function err(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function ok(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Wraps an API route handler with JWT auth + role check.
 * `membership` is the JWT token entry (lab_id, role, user_type).
 * Handlers that need full DB membership (student_level, borrow_restricted_until, etc.)
 * should read it themselves via readDb('_global', 'lab_memberships.json').
 */
export function withAuth(
  handler: (
    event: RequestEvent,
    user: JwtPayload,
    membership: LabMembershipToken,
  ) => Promise<Response>,
  options: { minRole?: Role; anyOf?: Role[] } = {},
) {
  return async (event: RequestEvent): Promise<Response> => {
    const token = event.cookies.get('token');
    if (!token) return err(401, 'Unauthorized');

    let user: JwtPayload;
    try {
      user = await verifyToken(token);
    } catch {
      return err(401, 'Unauthorized');
    }

    if (user.partial) return err(401, 'TOTP verification required');

    const labId = event.params.labId as string | undefined;
    const isSuper = user.memberships.some(
      (m) => m.lab_id === '_global' && m.role === 'admin',
    );

    const membership = labId ? getMembership(user, labId) : undefined;

    if (labId) {
      // Lab-scoped route: enforce membership + role
      if (!isSuper) {
        if (!membership) return err(403, 'Forbidden');
        const role = membership.role as Role;
        if (options.minRole && ROLE_HIERARCHY[role] < ROLE_HIERARCHY[options.minRole]) {
          return err(403, 'Forbidden');
        }
        if (options.anyOf && !options.anyOf.includes(role)) {
          return err(403, 'Forbidden');
        }
      }
    } else if (options.minRole || options.anyOf) {
      // Global route with explicit role requirement: must be super-admin
      if (!isSuper) return err(403, 'Forbidden');
    }

    return handler(event, user, membership as LabMembershipToken);
  };
}
