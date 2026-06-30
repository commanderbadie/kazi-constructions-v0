// Shared phone helpers — used by the lead popup, the leads API, and anywhere
// else we accept a mobile number. The goal is NOT airtight identity
// verification (that needs OTP); it's a cheap, zero-friction filter that
// rejects obviously fake / junk numbers before they become leads.

/**
 * Strip everything that isn't a digit and drop a leading country code so we
 * end up with a bare 10-digit Indian mobile number where possible.
 *   "+91 98765 43210" -> "9876543210"
 *   "0098765 43210"   -> "9876543210"
 */
export function normalizePhone(input: string): string {
  let digits = String(input ?? "").replace(/\D/g, "")
  // Drop a leading 0 (STD prefix) or 91 country code if it leaves 10 digits.
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  return digits
}

// A small set of well-known junk numbers people type to skip a form.
const KNOWN_JUNK = new Set([
  "1234567890",
  "0123456789",
  "9876543210",
  "1111111111",
  "1234512345",
  "9999999999",
  "8888888888",
  "7777777777",
  "6666666666",
])

/** All ten digits identical, e.g. 9999999999. */
function isAllSameDigit(phone: string): boolean {
  return /^(\d)\1{9}$/.test(phone)
}

/** Strictly ascending or descending run, e.g. 9876543210 / 1234567890. */
function isSequential(phone: string): boolean {
  let asc = true
  let desc = true
  for (let i = 1; i < phone.length; i++) {
    const prev = phone.charCodeAt(i - 1)
    const cur = phone.charCodeAt(i)
    if (cur !== prev + 1) asc = false
    if (cur !== prev - 1) desc = false
  }
  return asc || desc
}

export type PhoneCheck = { ok: true; phone: string } | { ok: false; reason: string }

/**
 * Validate an Indian mobile number with cheap junk detection.
 * Returns the normalized 10-digit number when valid.
 */
export function validateIndianMobile(input: string): PhoneCheck {
  const phone = normalizePhone(input)

  // Indian mobiles are 10 digits starting 6, 7, 8 or 9.
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { ok: false, reason: "Please enter a valid 10-digit mobile number" }
  }
  if (isAllSameDigit(phone) || isSequential(phone) || KNOWN_JUNK.has(phone)) {
    return {
      ok: false,
      reason: "That number doesn't look real. Please enter your actual mobile number.",
    }
  }
  return { ok: true, phone }
}

/**
 * Short, human-friendly reference code attached to each lead so a WhatsApp
 * message can be matched back to its lead record at a glance.
 *   e.g. "K-7F3Q"
 */
export function generateRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no easily-confused chars
  let code = ""
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `K-${code}`
}
