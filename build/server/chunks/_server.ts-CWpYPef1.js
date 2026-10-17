import { w as withAuth, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const GET = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const { searchParams } = ctx.url;
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  let reservations = readDb(labId, "reservations.json").filter(
    (r) => !["cancelled", "expired", "rejected"].includes(r.status)
  );
  if (start) {
    const startMs = new Date(start).getTime();
    reservations = reservations.filter((r) => new Date(r.end_at).getTime() >= startMs);
  }
  if (end) {
    const endMs = new Date(end).getTime();
    reservations = reservations.filter((r) => new Date(r.start_at).getTime() <= endMs);
  }
  const role = membership?.role;
  if (role === "student") {
    const ownEvents = reservations.filter((r) => r.user_id === user.user_id).map(toFullEvent);
    const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
    const units = readDb(labId, "units.json").filter((u) => !u.deleted_at);
    const availabilityBars = items.flatMap((item) => {
      const overlapping = reservations.filter(
        (r) => r.lines.some((l) => l.item_id === item.id)
      );
      if (overlapping.length === 0) return [];
      const totalUnits = item.tracking_mode === "serialized" ? units.filter((u) => u.item_id === item.id && u.status !== "retired").length : item.quantity_total ?? 0;
      return overlapping.map((r) => {
        const reserved = r.lines.filter((l) => l.item_id === item.id).reduce((s, l) => s + l.quantity, 0);
        return {
          id: `avail-${item.id}-${r.id}`,
          resourceId: item.id,
          start: r.start_at,
          end: r.end_at,
          title: `${Math.max(0, totalUnits - reserved)} available`,
          display: "background"
        };
      });
    });
    return ok({ events: [...ownEvents, ...availabilityBars] });
  }
  if (role === "instructor") {
    const visible = reservations.filter(
      (r) => r.user_id === user.user_id || r.instructor_id === user.user_id
    );
    return ok({ events: visible.map(toFullEvent) });
  }
  return ok({ events: reservations.map(toFullEvent) });
}, { minRole: "viewer" });
function toFullEvent(r) {
  return {
    id: r.id,
    start: r.start_at,
    end: r.end_at,
    title: r.purpose,
    extendedProps: {
      status: r.status,
      user_id: r.user_id,
      course_code: r.course_code,
      lines: r.lines,
      borrow_id: r.borrow_id
    }
  };
}

export { GET };
//# sourceMappingURL=_server.ts-CWpYPef1.js.map
