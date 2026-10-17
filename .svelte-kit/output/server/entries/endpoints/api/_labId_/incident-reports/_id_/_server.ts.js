import { w as withAuth, e as err, o as ok } from "../../../../../../chunks/middleware.js";
import { a as readDb, w as withLocks, c as commit } from "../../../../../../chunks/db.js";
const GET = withAuth(async (ctx) => {
  const { labId, id } = ctx.params;
  const reports = readDb(labId, "incident_reports.json");
  const report = reports.find((r) => r.id === id);
  if (!report) return err(404, "Incident report not found");
  return ok(report);
}, { minRole: "technician" });
const PATCH = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  let body = {};
  try {
    body = await ctx.request.json();
  } catch {
  }
  return withLocks(labId, ["alerts.json", "incident_reports.json"], async () => {
    const reports = readDb(labId, "incident_reports.json");
    const alerts = readDb(labId, "alerts.json");
    const report = reports.find((r) => r.id === id);
    if (!report) return err(404, "Incident report not found");
    if (report.resolved_at) return err(409, "Already resolved");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    report.resolved_at = now;
    report.resolution_notes = body?.resolution_notes ?? "";
    alerts.filter((a) => a.kind === "incident_open" && a.item_id === report.item_id && !a.resolved_at).forEach((a) => {
      a.resolved_at = now;
    });
    await commit({
      labId,
      writes: [
        ["incident_reports.json", reports],
        ["alerts.json", alerts]
      ],
      audit: {
        action: "incident.resolve",
        entity_type: "incident_report",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "technician",
        ip: ctx.getClientAddress()
      }
    });
    return ok(report);
  });
}, { minRole: "technician" });
export {
  GET,
  PATCH
};
