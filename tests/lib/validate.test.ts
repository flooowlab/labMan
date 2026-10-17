import { describe, it, expect } from 'vitest';
import { LoginSchema, ItemSchema, BorrowSchema, UnitSchema, sanitizeCode } from '../../src/lib/validate.js';

describe('validate', () => {
  describe('LoginSchema', () => {
    it('accepts valid credentials', () => {
      const result = LoginSchema.safeParse({ email: 'a@b.com', password: 'secret123' });
      expect(result.success).toBe(true);
    });
    it('rejects missing password', () => {
      const result = LoginSchema.safeParse({ email: 'a@b.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('sanitizeCode', () => {
    it('trims and removes special chars', () => {
      expect(sanitizeCode(' abc-123 ')).toBe('abc-123');
    });
    it('removes non-alphanumeric except hyphen and colon', () => {
      expect(sanitizeCode('hello world!')).toBe('helloworld');
    });
  });

  describe('ItemSchema', () => {
    const base = { name: 'Camera', category: 'electronics', tracking_mode: 'serialized', quantity_total: null, quantity_available: null, min_stock_alert: null };
    it('accepts valid item with required fields', () => {
      const good = ItemSchema.safeParse(base);
      expect(good.success).toBe(true);
    });
    it('rejects missing name', () => {
      const bad = ItemSchema.safeParse({ ...base, name: undefined });
      expect(bad.success).toBe(false);
    });
    it('rejects invalid tracking_mode', () => {
      const result = ItemSchema.safeParse({ ...base, tracking_mode: 'unknown' });
      expect(result.success).toBe(false);
    });
  });
});
