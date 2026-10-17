import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../src/lib/types.js';

// Mock db and auth modules
vi.mock('../../src/lib/db.js', () => ({ readDb: vi.fn(() => []) }));
vi.mock('../../src/lib/auth.js', () => ({
  getMembership: vi.fn(() => ({
    role: 'student',
    user_type: 'student',
    student_level: 2,
    is_active: true,
    borrow_restricted_until: null,
  })),
}));

import { assertEligible } from '../../src/lib/eligibility.js';
import { readDb } from '../../src/lib/db.js';
import { getMembership } from '../../src/lib/auth.js';

const mockItem = {
  id: 'item1',
  name: 'Camera',
  category: 'camera',
  tracking_mode: 'serialized' as const,
  availability_rule_id: null,
  // required fields
  lab_id: 'lab1', sku: null, barcode: 'BC', qr_code: 'QR', brand: '', model: '', quantity_total: null,
  quantity_available: null, min_stock_alert: null, owner_id: null, default_location_id: null,
  description: null, photo_url: null, image_path: null, official_page_url: null, datasheet_url: null,
  tutorial_links: [], included_accessories: [], manual_file_ids: [], label_size: 'standard' as const,
  notes: '', created_at: '', updated_at: '', deleted_at: null,
};

const mockUser = { user_id: 'u1', memberships: [], email: 'a@b.com' };

describe('eligibility', () => {
  beforeEach(() => {
    vi.mocked(readDb).mockReturnValue([]);
  });

  it('allows borrow when no availability rule', async () => {
    const authId = await assertEligible('lab1', mockItem, mockUser as any);
    expect(authId).toBeNull();
  });

  it('throws 403 when user has no membership', async () => {
    vi.mocked(getMembership).mockReturnValueOnce(null as any);
    await expect(assertEligible('lab1', mockItem, mockUser as any)).rejects.toBeInstanceOf(ApiError);
  });

  it('throws 403 when borrowing is suspended', async () => {
    vi.mocked(getMembership).mockReturnValueOnce({
      role: 'student', user_type: 'student', student_level: 2, is_active: true,
      borrow_restricted_until: new Date(Date.now() + 86_400_000).toISOString(),
    } as any);
    await expect(assertEligible('lab1', mockItem, mockUser as any)).rejects.toBeInstanceOf(ApiError);
  });
});
