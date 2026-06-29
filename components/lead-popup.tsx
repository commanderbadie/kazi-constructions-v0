"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const STORAGE_KEY = "kazi-lead-popup-seen"
const SUBMITTED_KEY = "kazi-lead-submitted-at"
const DELAY_MS = 20000
const COOLDOWN_MS = 15 * 60 * 1000 // 15 minutes

function IndiaFlag() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-[18px] rounded-[2px]" aria-hidden="true">
      <rect width="18" height="4" fill="#FF9933" />
      <rect y="4" width="18" height="4" fill="#ffffff" />
      <rect y="8" width="18" height="4" fill="#138808" />
      <circle cx="9" cy="6" r="1.3" fill="none" stroke="#0a3d91" strokeWidth="0.4" />
    </svg>
  )
}

const trustBadges = [
  {
    value: "Licensed",
    label: "GHMC Certified",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z" />
        <path d="M8.5 12l2.3 2.3L15.5 9.5" />
      </svg>
    ),
  },
  {
    value: "10+ Years",
    label: "Experience",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <circle cx="12" cy="8" r="6" />
        <path d="M12 5.4l1 2 2.2.3-1.6 1.5.4 2.1-2-1-2 1 .4-2.1L8.8 7.7l2.2-.3z" />
        <path d="M8.5 13.3L7 22l5-2.6L17 22l-1.5-8.7" />
      </svg>
    ),
  },
  {
    value: "140+",
    label: "Happy Clients",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.3 14.2s1.4 1.9 3.7 1.9 3.7-1.9 3.7-1.9" />
        <path d="M9 9.5h.01M15 9.5h.01" />
      </svg>
    ),
  },
]

const inputClass =
  "w-full rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"

export function LeadPopup() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [warning, setWarning] = useState("")
  const [phoneError, setPhoneError] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(STORAGE_KEY)) return

    // Don't show popup if submitted within the cooldown period
    const submittedAt = localStorage.getItem(SUBMITTED_KEY)
    if (submittedAt && Date.now() - Number(submittedAt) < COOLDOWN_MS) return

    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem(STORAGE_KEY, "1")
    }, DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setWarning("")
    setPhoneError("")

    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") || "").trim()
    const phone = String(data.get("phone") || "").trim().replace(/\s/g, "")
    const location = String(data.get("location") || "").trim()

    // Validate phone: exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid 10-digit mobile number")
      return
    }

    // Check 15-minute cooldown
    const submittedAt = localStorage.getItem(SUBMITTED_KEY)
    if (submittedAt && Date.now() - Number(submittedAt) < COOLDOWN_MS) {
      const minsLeft = Math.ceil(
        (COOLDOWN_MS - (Date.now() - Number(submittedAt))) / 60000
      )
      setWarning(`You've already submitted. Please try again in ${minsLeft} minute${minsLeft > 1 ? "s" : ""}.`)
      return
    }

    // Mark submission time
    localStorage.setItem(SUBMITTED_KEY, String(Date.now()))

    // Save in the background
    try {
      void fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name,
          phone,
          location,
          website: data.get("website"), // honeypot
        }),
      })
    } catch {
      // Non-fatal
    }

    // Close popup immediately
    setOpen(false)
    document.body.style.overflow = ""

    // Navigate to thank-you
    const qs = new URLSearchParams()
    if (name) qs.set("name", name)
    if (phone) qs.set("phone", `+91 ${phone}`)
    if (location) qs.set("city", location)
    router.push(`/thank-you?${qs.toString()}`)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2
          id="lead-popup-title"
          className="pr-6 text-center font-heading text-xl font-extrabold leading-snug text-accent sm:text-2xl"
        >
          Don&apos;t leave yet! Resolve your queries with our construction
          expert
        </h2>
        <p className="mt-3 text-center text-sm font-medium text-primary/80">
          Trusted Builders for End-to-End Home Construction
        </p>

        {warning && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-700">
            {warning}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Honeypot — hidden from real users, catches bots */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name*"
            aria-label="Full Name"
            className={inputClass}
          />
          <div>
            <div className="flex">
              <span className="flex shrink-0 items-center gap-1.5 rounded-l-lg border border-r-0 border-border bg-muted/60 px-3 text-sm font-medium text-foreground">
                <IndiaFlag />
                +91
              </span>
              <input
                type="tel"
                name="phone"
                required
                maxLength={10}
                pattern="\d{10}"
                placeholder="10-digit Mobile Number*"
                aria-label="Mobile Number"
                onChange={() => setPhoneError("")}
                className={`${inputClass} rounded-l-none`}
              />
            </div>
            {phoneError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{phoneError}</p>
            )}
          </div>
          <input
            type="text"
            name="location"
            required
            placeholder="Location of your plot*"
            aria-label="Location of your plot"
            className={inputClass}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3.5 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            Start Your Construction
          </button>
        </form>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          <span className="text-gold">*</span>By submitting, you agree to
          our{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Privacy Policy,
          </a>{" "}
          allowing us to use your information as outlined
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center">
              <span className="text-gold">{badge.icon}</span>
              <span className="mt-2 font-heading text-lg font-extrabold text-accent">
                {badge.value}
              </span>
              <span className="text-xs font-medium text-primary/70">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
