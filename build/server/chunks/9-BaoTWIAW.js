import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import { a as generatePrintToken } from './ids-CipgF91a.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Mg8RYffl.js')).default;
const server_id = "src/routes/[lab]/(protected)/borrows/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/9.BdQGXNlv.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-BaoTWIAW.js.map
