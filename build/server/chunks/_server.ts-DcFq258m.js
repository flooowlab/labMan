import { w as withAuth, o as ok, e as err } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, I as IncidentReportSchema } from './validate-NtJDb-c4.js';
import { n as newId } from './ids-CipgF91a.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId;
  const { searchParams } = ctx.url;
  let reports = readDb(labId, "incident_reports.json");
  const borrowId = searchParams.get("borrow_id");
  const itemId = searchParams.get("item_id");
  const resolved = searchParams.get("resolved");
  if (borrowId) reports = reports.filter((r) => r.borrow_id === borrowId);
  if (itemId) reports = reports.filter((r) => r.item_id === itemId);
  if (resolved === "false") reports = reports.filter((r) => !r.resolved_at);
  if (resolved === "true") reports = reports.filter((r) => !!r.resolved_at);
  return ok(reports);
}, { minRole: "technician" });
const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const parsed = await parseBody(ctx.request, IncidentReportSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  const borrows = readDb(labId, "borrows.json");
  const borrow = borrows.find((b) => b.id === data.borrow_id);
  if (!borrow) return err(404, "Borrow not found");
  const line = borrow.lines.find((l) => l.id === data.borrow_line_id);
  if (!line) return err(404, "Borrow line not found");
  return withLocks(labId, ["alerts.json", "borrows.json", "incident_reports.json"], async () => {
    const reports = readDb(labId, "incident_reports.json");
    const borrowsFresh = readDb(labId, "borrows.json");
    const alerts = readDb(labId, "alerts.json");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const report = {
      id: newId(),
      lab_id: labId,
      borrow_id: data.borrow_id,
      borrow_line_id: data.borrow_line_id,
      unit_id: data.unit_id ?? null,
      item_id: data.item_id,
      kind: data.kind,
      severity: data.severity,
      description: data.description,
      photo_paths: [],
      reported_by: user.user_id,
      reported_at: now,
      resolved_at: null,
      resolution_notes: ""
    };
    const borrowRecord = borrowsFresh.find((b) => b.id === data.borrow_id);
    if (borrowRecord) {
      const borrowLine = borrowRecord.lines.find((l) => l.id === data.borrow_line_id);
      if (borrowLine) borrowLine.incident_report_id = report.id;
    }
    const alert = {
      id: newId(),
      lab_id: labId,
      kind: "incident_open",
      borrow_id: data.borrow_id,
      reservation_id: null,
      item_id: data.item_id,
      user_id: null,
      message: `Incident reported: ${data.kind} (${data.severity}) on item ${data.item_id}`,
      triggered_at: now,
      resolved_at: null,
      severity: data.severity === "total_loss" ? "critical" : data.severity === "major" ? "overdue" : "warning",
      acknowledged: false,
      acknowledged_by: null,
      acknowledged_at: null
    };
    await commit({
      labId,
      writes: [
        ["incident_reports.json", [...reports, report]],
        ["borrows.json", borrowsFresh],
        ["alerts.json", [...alerts, alert]]
      ],
      audit: {
        action: "incident.create",
        entity_type: "incident_report",
        entity_id: report.id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "technician",
        after: { kind: data.kind, severity: data.severity, item_id: data.item_id },
        ip: ctx.getClientAddress()
      }
    });
    return ok(report, 201);
  });
}, { minRole: "technician" });

export { GET, POST };
//# sourceMappingURL=_server.ts-DcFq258m.js.map
