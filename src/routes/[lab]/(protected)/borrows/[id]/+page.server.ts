import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import { generatePrintToken } from '$lib/ids.js';
import type { BorrowRecord, Item, Unit, User } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab!.id;

  const borrow = readDb<BorrowRecord>(labId, 'borrows.json').find((b) => b.id === params.id);
  if (!borrow) throw redirect(302, `/${params.lab}/borrows`);

  if (['student', 'viewer'].includes(membership!.role) && borrow.user_id !== authUser.user_id) {
    throw redirect(302, `/${params.lab}/borrows`);
  }

  const items = readDb<Item>(labId, 'items.json');
  const units = readDb<Unit>(labId, 'units.json');
  const users = readDb<User>('_global', 'users.json');

  const borrower = users.find((u) => u.id === borrow.user_id);
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const unitMap = Object.fromEntries(units.map((u) => [u.id, u.barcode ?? u.id]));

  const canReturn = ['admin', 'manager', 'technician'].includes(membership!.role)
    && ['active', 'overdue', 'partially_returned'].includes(borrow.status);

  const printToken = generatePrintToken(borrow.id);

  return { borrow, borrower: borrower ? { name: borrower.name, email: borrower.email } : null, itemMap, unitMap, canReturn, printToken, labId };
};
