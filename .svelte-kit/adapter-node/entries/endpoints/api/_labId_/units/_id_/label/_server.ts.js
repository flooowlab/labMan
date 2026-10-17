import { w as withAuth, e as err } from "../../../../../../../chunks/middleware.js";
import { a as readDb } from "../../../../../../../chunks/db.js";
import { b as buildLabelHtml } from "../../../../../../../chunks/label.js";
const GET = withAuth(async (ctx, _user, _membership) => {
  const { labId, id } = ctx.params;
  const units = readDb(labId, "units.json");
  const unit = units.find((u) => u.id === id && !u.deleted_at);
  if (!unit) return err(404, "Unit not found");
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === unit.item_id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.id === labId);
  const labName = lab?.name ?? labId;
  const html = await buildLabelHtml(item, [unit], { labName });
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}, { minRole: "viewer" });
export {
  GET
};
