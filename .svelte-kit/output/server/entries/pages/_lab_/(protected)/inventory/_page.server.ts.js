import { a as readDb } from "../../../../../chunks/db.js";
const load = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const units = readDb(labId, "units.json").filter((u) => !u.deleted_at);
  const q = url.searchParams.get("q")?.toLowerCase() ?? "";
  const catFilter = url.searchParams.get("category") ?? "";
  const modeFilter = url.searchParams.get("mode") ?? "";
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort();
  const filtered = items.filter((i) => {
    if (catFilter && i.category !== catFilter) return false;
    if (modeFilter && i.tracking_mode !== modeFilter) return false;
    if (q && !i.name.toLowerCase().includes(q) && !(i.sku ?? "").toLowerCase().includes(q)) return false;
    return true;
  });
  const rows = filtered.map((item) => {
    const avail = item.tracking_mode === "bulk" ? item.quantity_available ?? 0 : units.filter((u) => u.item_id === item.id && u.status === "available").length;
    const total = item.tracking_mode === "bulk" ? item.quantity_total ?? 0 : units.filter((u) => u.item_id === item.id).length;
    return { id: item.id, name: item.name, sku: item.sku ?? null, category: item.category ?? null, tracking_mode: item.tracking_mode, avail, total };
  });
  return { rows, categories, q, catFilter, modeFilter, labId, labSlug: lab.slug, role: membership.role };
};
export {
  load
};
