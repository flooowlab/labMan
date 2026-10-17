function statusClass(s) {
  const map = {
    active: "badge-green",
    available: "badge-green",
    approved: "badge-green",
    good: "badge-green",
    new: "badge-blue",
    completed: "badge-green",
    overdue: "badge-red",
    lost: "badge-red",
    damaged: "badge-red",
    rejected: "badge-red",
    borrowed: "badge-yellow",
    reserved: "badge-yellow",
    fair: "badge-yellow",
    partially_returned: "badge-yellow",
    maintenance: "badge-yellow",
    pending_instructor: "badge-blue",
    pending_manager: "badge-blue",
    returned: "badge-blue",
    cancelled: "badge-gray",
    expired: "badge-gray",
    retired: "badge-gray"
  };
  return `badge ${map[s] ?? "badge-gray"}`;
}
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
export {
  fmtDate as f,
  statusClass as s
};
