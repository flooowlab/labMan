import { redirect } from '@sveltejs/kit';
import { readAuditLog } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  if (membership!.role !== 'admin') throw redirect(302, `/${(await parent()).lab?.slug}/`);

  const labId = lab!.id;
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const actionFilter = url.searchParams.get('action') ?? '';
  const perPage = 50;

  const allEntries = readAuditLog(labId);
  const filtered = actionFilter ? allEntries.filter((e) => e.action?.includes(actionFilter)) : allEntries;
  const total = filtered.length;
  const entries = filtered.slice((page - 1) * perPage, page * perPage).reverse();

  return { entries, total, page, perPage, actionFilter };
};
