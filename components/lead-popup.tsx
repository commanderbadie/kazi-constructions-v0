"use client"

import type React from "react"
import { useEffect, useState } from "react"

const STORAGE_KEY = "kazi-lead-popup-seen"
const DELAY_MS = 5000

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
    value: "10,000+",
    label: "Homes Built",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <path d="M12 2l1.6 3.3 3.6.5-2.6 2.5.6 3.6L12 10.7 8.8 12.4l.6-3.6L6.8 6.3l3.6-.5L12 2z" />
        <path d="M5 21v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
        <circle cx="12" cy="16.5" r="0.4" />
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Money Safety",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z" />
        <path d="M9 11.5c0-1 1-1.7 3-1.7M9 13.5c0 1 1 1.7 3 1.7m0-5.4c1.2 0 2.2.4 2.6 1M12 8v8.5" />
      </svg>
    ),
  },
  {
    value: "470+",
    label: "Quality Checks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <circle cx="12" cy="10" r="6" />
        <path d="M9.5 10l1.7 1.7L14.5 8.5" />
        <path d="M8.5 15.5L7 22l5-2.5L17 22l-1.5-6.5" />
      </svg>
    ),
  },
]

const inputClass =
  "w-full rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"

export function LeadPopup() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(STORAGE_KEY)) return

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
    const form = e.currentTarget
    const fd = new FormData(form)

    setSubmitting(true)
    setError(false)
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          location: fd.get("location"),
          source: "popup",
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error("failed")
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
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

        {submitted ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ef6c2d]/10 text-[#ef6c2d]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="mt-5 font-heading text-2xl font-extrabold text-accent">
              Thank you!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our construction expert will reach out to you shortly to discuss
              your project.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full bg-[#ef6c2d] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#d95f24]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name*"
                aria-label="Full Name"
                className={inputClass}
              />
              <div className="flex">
                <span className="flex shrink-0 items-center gap-1.5 rounded-l-lg border border-r-0 border-border bg-muted/60 px-3 text-sm font-medium text-foreground">
                  <IndiaFlag />
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Mobile Number*"
                  aria-label="Mobile Number"
                  className={`${inputClass} rounded-l-none`}
                />
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
                disabled={submitting}
                className="w-full rounded-lg bg-[#ef6c2d] px-6 py-3.5 text-base font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#d95f24] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending..." : "Start Your Construction"}
              </button>
              {error && (
                <p className="text-sm font-medium text-destructive" role="alert">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              <span className="text-[#ef6c2d]">*</span>By submitting, you agree to
              our{" "}
              <a href="#" className="font-medium text-[#ef6c2d] hover:underline">
                Privacy Policy,
              </a>{" "}
              allowing us to use your information as outlined
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center">
                  <span className="text-[#ef6c2d]">{badge.icon}</span>
                  <span className="mt-2 font-heading text-lg font-extrabold text-accent">
                    {badge.value}
                  </span>
                  <span className="text-xs font-medium text-primary/70">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
