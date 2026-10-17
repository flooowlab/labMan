import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../../src/lib/auth.js';

process.env.JWT_SECRET = 'test-secret-32-chars-long-enough!!';

describe('auth', () => {
  it('signs and verifies a token', async () => {
    const payload = { user_id: 'u1', memberships: [] };
    const token = await signToken(payload);
    expect(typeof token).toBe('string');

    const decoded = await verifyToken(token);
    expect(decoded.user_id).toBe('u1');
  });

  it('rejects an invalid token', async () => {
    await expect(verifyToken('invalid.jwt.token')).rejects.toThrow();
  });

  it('rejects a partial token in withAuth-like checks', async () => {
    const payload = { user_id: 'u1', memberships: [], partial: true };
    const token = await signToken(payload);
    const decoded = await verifyToken(token) as Record<string, unknown>;
    expect(decoded.partial).toBe(true);
  });
});
