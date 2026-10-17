import { SignJWT, jwtVerify } from "jose";
function getSecret() {
  const raw = process.env.JWT_SECRET ?? "";
  if (!raw.trim()) throw new Error("JWT_SECRET env var is not set. Add it to .env (min 32 chars).");
  return new TextEncoder().encode(raw);
}
async function signToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(getSecret());
}
async function verifyToken(token) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}
function getMembership(user, labId) {
  return user.memberships.find((m) => m.lab_id === labId);
}
function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
    path: "/"
  };
}
export {
  cookieOptions as c,
  getMembership as g,
  signToken as s,
  verifyToken as v
};
