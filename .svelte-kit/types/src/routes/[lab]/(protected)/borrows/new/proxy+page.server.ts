// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { Item, User, LabMembership, Kit } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, url }: Parameters<PageServerLoad>[0]) => {
  const { lab, membership } = await parent();
  if (!['admin', 'manager', 'technician'].includes(membership!.role)) {
    throw redirect(302, '../borrows');
  }

  const labId = lab!.id;
  const items = readDb<Item>(labId, 'items.json').filter((i) => !i.deleted_at);
  const allMemberships = readDb<LabMembership>('_global', 'lab_memberships.json').filter((m) => m.lab_id === labId && m.is_active);
  const allUsers = readDb<User>('_global', 'users.json');
  const usersData = allMemberships.map((m) => {
    const u = allUsers.find((u) => u.id === m.user_id && u.is_active && !u.redacted_at);
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email, rfid_tag: u.rfid_tag, user_type: m.user_type };
  }).filter(Boolean) as { id: string; name: string; email: string; rfid_tag: string | null; user_type: string }[];

  const itemsData = items.map((i) => ({ id: i.id, name: i.name, category: i.category, tracking_mode: i.tracking_mode, barcode: i.barcode, quantity_available: i.quantity_available }));

  // Instructors list for student-borrow permission selector
  const instructorMembers = allMemberships.filter((m) => ['instructor', 'admin', 'manager'].includes(m.role));
  const instructors = instructorMembers.map((m) => {
    const u = allUsers.find((u) => u.id === m.user_id && u.is_active && !u.redacted_at);
    if (!u) return null;
    return { id: u.id, name: u.name, role: m.role };
  }).filter(Boolean) as { id: string; name: string; role: string }[];

  const kitId = url.searchParams.get('kit_id');
  type InitLine = { item_id: string; quantity: number; label: string };
  let initialLines: InitLine[] = [];
  let kitName: string | null = null;
  if (kitId) {
    const kits = readDb<Kit>(labId, 'kits.json');
    const kit = kits.find((k) => k.id === kitId && !k.deleted_at);
    if (kit) {
      kitName = kit.name;
      initialLines = kit.lines.map((l) => {
        const item = items.find((i) => i.id === l.item_id);
        return { item_id: l.item_id, quantity: l.quantity, label: item?.name ?? '(unknown)' };
      });
    }
  }

  return { labId, labSlug: lab!.slug, usersData, itemsData, instructors, initialLines, kitId: kitId ?? null, kitName };
};
