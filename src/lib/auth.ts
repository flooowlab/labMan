import { SignJWT, jwtVerify } from 'jose';
import type { JwtPayload } from './types.js';

function getSecret(): Uint8Array {
  const raw = process.env.JWT_SECRET ?? '';
  if (!raw.trim()) throw new Error('JWT_SECRET env var is not set. Add it to .env (min 32 chars).');
  return new TextEncoder().encode(raw);
}

export async function signToken(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as JwtPayload;
}

export function getMembership(user: JwtPayload, labId: string) {
  return user.memberships.find((m) => m.lab_id === labId);
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge,
    path: '/',
  };
}
