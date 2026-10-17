import { w as withLocks, a as readDb, c as commit } from "./db.js";
import { n as newId } from "./ids.js";
async function createAlert(labId, fields) {
  return withLocks(labId, ["alerts.json"], async () => {
    const alerts = readDb(labId, "alerts.json");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const alert = {
      id: newId(),
      lab_id: labId,
      kind: fields.kind,
      borrow_id: fields.borrow_id ?? null,
      reservation_id: fields.reservation_id ?? null,
      item_id: fields.item_id ?? null,
      user_id: fields.user_id ?? null,
      message: fields.message,
      triggered_at: now,
      resolved_at: null,
      severity: fields.severity,
      acknowledged: false,
      acknowledged_by: null,
      acknowledged_at: null
    };
    await commit({
      labId,
      writes: [["alerts.json", [...alerts, alert]]],
      audit: {
        action: "alert.create",
        entity_type: "alert",
        entity_id: alert.id,
        actor_id: "system",
        actor_role: "admin",
        after: { kind: fields.kind, severity: fields.severity }
      }
    });
    return alert;
  });
}
export {
  createAlert as c
};
