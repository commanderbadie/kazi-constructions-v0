"use client"

import type React from "react"
import { useState } from "react"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"

const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-foreground"

const officeAddress =
  "KAZI CONSTRUCTIONS, Suleman Nagar, Chintalmet, Hyderabad, Telangana 500052"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.215zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

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
          email: fd.get("email"),
          phone: fd.get("phone"),
          message: fd.get("message"),
          source: "consultation",
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error("failed")
      setSubmitted(true)
      form.reset()
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Get in touch
            </span>
            <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Request a <span className="font-normal italic text-primary">consultation</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Share a few details and our team will respond within one business
              day.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold">
                  Office
                </p>
                <p className="mt-2 leading-relaxed text-foreground">
                  4-25-2/3/3, Wadi-E-Mahmood, Suleman Nagar
                  <br />
                  Rajendra Nagar, Attapure, Hyderabad &ndash; 500052
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold">
                  Email
                </p>
                <a
                  href="mailto:kaziwaheeduddinsiddiqi@gmail.com"
                  className="mt-2 block font-medium text-primary transition-colors hover:text-primary/80"
                >
                  kaziwaheeduddinsiddiqi@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold">
                  Phone
                </p>
                <a
                  href="tel:+918801958508"
                  className="mt-2 block font-medium text-primary transition-colors hover:text-primary/80"
                >
                  +91 88019 58508
                </a>
              </div>
            </div>

            <a
              href="https://wa.me/918801958508"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1ebe57]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Scope, location, timeline, budget range..."
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </button>
              {submitted && (
                <p className="mt-4 text-sm font-medium text-primary" role="status">
                  Thanks! We&apos;ve received your message and will be in touch soon.
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm font-medium text-destructive" role="alert">
                  Sorry, something went wrong. Please try again or email us
                  directly.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Find Us
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Visit Our <span className="font-normal italic text-primary">Office</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md lg:col-span-2">
              <iframe
                title="Kazi Constructions office location on Google Maps"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  officeAddress,
                )}&z=15&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-full min-h-[420px] w-full border-0"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col rounded-2xl bg-navy p-8 text-white">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Address
                  </p>
                  <p className="mt-2 leading-relaxed text-white/90">
                    4-25-2/3/3, Wadi-E-Mahmood, Suleman Nagar
                    <br />
                    Rajendra Nagar, Attapure, Hyderabad &ndash; 500052
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Phone
                  </p>
                  <a
                    href="tel:+918801958508"
                    className="mt-2 block text-white/90 transition-colors hover:text-gold"
                  >
                    +91 88019 58508
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Email
                  </p>
                  <a
                    href="mailto:kaziwaheeduddinsiddiqi@gmail.com"
                    className="mt-2 block break-all text-white/90 transition-colors hover:text-gold"
                  >
                    kaziwaheeduddinsiddiqi@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Office Hours
                  </p>
                  <p className="mt-2 leading-relaxed text-white/90">
                    Mon&ndash;Fri: 8:00am &ndash; 6:00pm
                    <br />
                    Sat: 9:00am &ndash; 1:00pm
                  </p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  officeAddress,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
