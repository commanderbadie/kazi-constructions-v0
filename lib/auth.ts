// Server-side auth helpers for the /admin panel.
//
// Uses the Web Crypto API (globalThis.crypto.subtle) so the exact same code
// runs in both Edge middleware and Node route handlers. The admin password and
// signing secret live only in environment variables — they are never shipped
// to the browser.

const encoder = new TextEncoder()

export const SESSION_COOKIE = "kazi_admin_session"

// How long a login stays valid before requiring sign-in again.
export const SESSION_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let str = ""
  for (const b of arr) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(input: string): Uint8Array {
  let s = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0
  s += "=".repeat(pad)
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
  return toBase64Url(sig)
}

/** Constant-time string comparison to avoid timing side-channels. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/** SHA-256 of a string, base64url-encoded (fixed length for safe compares). */
export async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input))
  return toBase64Url(digest)
}

/**
 * Constant-time password check. Both sides are hashed first so the comparison
 * runs over fixed-length values regardless of the real password length.
 */
export async function verifyPassword(
  candidate: string,
  expected: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(candidate), sha256(expected)])
  return timingSafeEqual(a, b)
}

/** Create a signed, time-limited session token. */
export async function createSessionToken(secret: string): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })),
  )
  const sig = await hmac(payload, secret)
  return `${payload}.${sig}`
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
): Promise<boolean> {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [payload, sig] = parts

  const expected = await hmac(payload, secret)
  if (!timingSafeEqual(sig, expected)) return false

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)))
    return typeof data.exp === "number" && Date.now() < data.exp
  } catch {
    return false
  }
}
