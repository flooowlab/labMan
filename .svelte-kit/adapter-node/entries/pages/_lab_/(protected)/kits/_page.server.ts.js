import { a as readDb } from "../../../../../chunks/db.js";
const load = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const kits = readDb(labId, "kits.json").filter((k) => !k.deleted_at);
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const rows = kits.map((k) => ({
    id: k.id,
    name: k.name,
    version: k.version,
    lineCount: k.lines.length,
    linePreview: k.lines.slice(0, 3).map((l) => items.find((i) => i.id === l.item_id)?.name ?? "(deleted)").join(", ") + (k.lines.length > 3 ? ` +${k.lines.length - 3} more` : "")
  }));
  return { rows, isManager: ["admin", "manager"].includes(membership.role) };
};
export {
  load
};
