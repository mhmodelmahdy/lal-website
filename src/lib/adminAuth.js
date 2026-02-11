import crypto from "crypto";

const COOKIE_NAME = "lal_admin";

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

export function createAdminToken(payload) {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  const json = JSON.stringify(payload);
  const data = base64url(json);
  const sig = sign(data, secret);
  return `${data}.${sig}`;
}

export function verifyAdminToken(token) {
  try {
    const secret = process.env.ADMIN_COOKIE_SECRET;
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expected = sign(data, secret);
    if (sig !== expected) return null;

    const json = Buffer.from(data, "base64url").toString("utf8");
    const payload = JSON.parse(json);

    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ✅ بدل requireAdmin() خليها تستقبل token
export function requireAdminFromToken(token) {
  if (!token) return null;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };
