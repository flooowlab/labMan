import { a as readDb } from './db-CfhGAyvN.js';
import { v as verifyPrintToken } from './ids-CipgF91a.js';
import { b as buildPrintHtml } from './print-WHcfKY6D.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const GET = async (ctx) => {
  const { labId, id: borrowId } = ctx.params;
  const authHeader = ctx.request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || !verifyPrintToken(token, borrowId)) {
    return new Response(JSON.stringify({ error: "Invalid or expired print token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const borrows = readDb(labId, "borrows.json");
  const borrow = borrows.find((b) => b.id === borrowId);
  if (!borrow) {
    return new Response(JSON.stringify({ error: "Borrow not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  const html = buildPrintHtml(labId, borrow);
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-sBeo26Nb.js.map
