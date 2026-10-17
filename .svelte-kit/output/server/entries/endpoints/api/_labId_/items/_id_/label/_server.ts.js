import { w as withAuth, e as err } from "../../../../../../../chunks/middleware.js";
import { a as readDb } from "../../../../../../../chunks/db.js";
import { b as buildLabelHtml } from "../../../../../../../chunks/label.js";
const GET = withAuth(async (ctx, _user, _membership) => {
  const { labId, id } = ctx.params;
  const format = ctx.url.searchParams.get("format") ?? "pdf";
  const count = parseInt(ctx.url.searchParams.get("count") ?? "8", 10) || 8;
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.id === labId);
  const labName = lab?.name ?? labId;
  let units = [];
  if (format === "units-sheet" || item.tracking_mode === "serialized") {
    units = readDb(labId, "units.json").filter(
      (u) => u.item_id === id && !u.deleted_at && u.status !== "retired"
    );
  }
  const html = await buildLabelHtml(item, units, {
    labName,
    count: format === "sheet" ? count : 1
  });
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}, { minRole: "viewer" });
export {
  GET
};
