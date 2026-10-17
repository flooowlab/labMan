import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import type { IncidentReport, Alert } from '$lib/types.js';

// GET /api/:labId/incident-reports/:id
export const GET = withAuth(async (ctx) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const reports = readDb<IncidentReport>(labId, 'incident_reports.json');
  const report = reports.find((r) => r.id === id);
  if (!report) return err(404, 'Incident report not found');
  return ok(report);
}, { minRole: 'technician' });

// PATCH /api/:labId/incident-reports/:id — resolve an incident
export const PATCH = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  let body: { resolution_notes?: string } = {};
  try {
    body = await ctx.request.json() as { resolution_notes?: string };
  } catch { /* optional body */ }

  return withLocks(labId, ['alerts.json', 'incident_reports.json'], async () => {
    const reports = readDb<IncidentReport>(labId, 'incident_reports.json');
    const alerts = readDb<Alert>(labId, 'alerts.json');

    const report = reports.find((r) => r.id === id);
    if (!report) return err(404, 'Incident report not found');
    if (report.resolved_at) return err(409, 'Already resolved');

    const now = new Date().toISOString();
    report.resolved_at = now;
    report.resolution_notes = body?.resolution_notes ?? '';

    // Resolve related incident_open alerts
    alerts
      .filter((a) => a.kind === 'incident_open' && a.item_id === report.item_id && !a.resolved_at)
      .forEach((a) => {
        a.resolved_at = now;
      });

    await commit({
      labId,
      writes: [
        ['incident_reports.json', reports],
        ['alerts.json', alerts],
      ],
      audit: {
        action: 'incident.resolve',
        entity_type: 'incident_report',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'technician',
        ip: ctx.getClientAddress(),
      },
    });

    return ok(report);
  });
}, { minRole: 'technician' });
