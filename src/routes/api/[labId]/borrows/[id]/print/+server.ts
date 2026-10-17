import { readDb } from '$lib/db.js';
import { verifyPrintToken } from '$lib/ids.js';
import { buildPrintHtml } from '$lib/print.js';
import type { BorrowRecord } from '$lib/types.js';

// GET /api/:labId/borrows/:id/print
// Auth: print token via Authorization: Bearer <token> header
export const GET = async (ctx) => {
  const { labId, id: borrowId } = ctx.params as { labId: string; id: string };

  const authHeader = ctx.request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token || !verifyPrintToken(token, borrowId)) {
    return new Response(JSON.stringify({ error: 'Invalid or expired print token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
  const borrow = borrows.find((b) => b.id === borrowId);
  if (!borrow) {
    return new Response(JSON.stringify({ error: 'Borrow not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = buildPrintHtml(labId, borrow);
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
