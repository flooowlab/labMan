import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../../../../../chunks/db.js";
import { a as generatePrintToken } from "../../../../../../chunks/ids.js";
const load = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const borrow = readDb(labId, "borrows.json").find((b) => b.id === params.id);
  if (!borrow) throw redirect(302, `/${params.lab}/borrows`);
  if (["student", "viewer"].includes(membership.role) && borrow.user_id !== authUser.user_id) {
    throw redirect(302, `/${params.lab}/borrows`);
  }
  const items = readDb(labId, "items.json");
  const units = readDb(labId, "units.json");
  const users = readDb("_global", "users.json");
  const borrower = users.find((u) => u.id === borrow.user_id);
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const unitMap = Object.fromEntries(units.map((u) => [u.id, u.barcode ?? u.id]));
  const canReturn = ["admin", "manager", "technician"].includes(membership.role) && ["active", "overdue", "partially_returned"].includes(borrow.status);
  const printToken = generatePrintToken(borrow.id);
  return { borrow, borrower: borrower ? { name: borrower.name, email: borrower.email } : null, itemMap, unitMap, canReturn, printToken, labId };
};
export {
  load
};
