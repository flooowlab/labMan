/**
 * Email notifications via nodemailer.
 * Input:  userId, event type, optional payload
 * Output: void — fire-and-forget; errors are logged, never thrown
 *
 * Requires env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 * Gracefully skips if SMTP_HOST is not configured.
 */
import nodemailer from 'nodemailer';
import { readDb } from './db.js';
import type { User } from './types.js';

type NotifyEvent =
  | 'borrow_overdue_warning'
  | 'borrow_suspended'
  | 'extension_approved'
  | 'extension_rejected'
  | 'reservation_approved'
  | 'reservation_rejected'
  | 'reservation_cancelled';

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

const SUBJECTS: Record<NotifyEvent, string> = {
  borrow_overdue_warning: 'Reminder: equipment return overdue',
  borrow_suspended:       'Borrowing suspended due to overdue return',
  extension_approved:     'Your loan extension has been approved',
  extension_rejected:     'Your loan extension was rejected',
  reservation_approved:   'Your reservation has been approved',
  reservation_rejected:   'Your reservation was not approved',
  reservation_cancelled:  'Your reservation has been cancelled',
};

function buildBody(event: NotifyEvent, payload: Record<string, unknown>): string {
  const lines = Object.entries(payload).map(([k, v]) => `${k}: ${v}`);
  return `Event: ${event}\n\n${lines.join('\n')}\n\nPlease log in to the lab portal for details.`;
}

export async function notifyUser(
  userId: string,
  event: NotifyEvent,
  payload: Record<string, unknown> = {},
): Promise<void> {
  try {
    const transport = getTransport();
    if (!transport) {
      console.log(`[notify] (smtp off) user=${userId} event=${event}`, payload);
      return;
    }
    const users = readDb<User>('_global', 'users.json');
    const user = users.find((u) => u.id === userId);
    if (!user?.email) return;

    await transport.sendMail({
      from: process.env.SMTP_FROM ?? 'Lab Manager <noreply@lab.example.com>',
      to: user.email,
      subject: SUBJECTS[event] ?? event,
      text: buildBody(event, payload),
    });
  } catch (e) {
    console.error(`[notify] failed user=${userId} event=${event}`, e);
  }
}
