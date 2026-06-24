"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"

const details = [
  {
    icon: MapPin,
    label: "Address",
    value:
      "4-25-2/3/3, Wadi-E-Mahmood, Suleman Nagar, Rajendra Nagar, PVNR Pillar No.242-500052, Hyderabad",
  },
  { icon: Phone, label: "Phone", value: "+91 8801958508" },
  { icon: Mail, label: "Email", value: "builders.kazi@gmail.com" },
  { icon: AtSign, label: "Instagram", value: "kazi_constructions" },
]

const inputClass =
  "w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Get in touch
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
            Let&apos;s build something great
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Tell us about your project and our team will get back to you with a
            free, no-obligation quote.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ul className="grid gap-5">
              {details.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 font-medium text-foreground">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Full Name
                  </label>
                  <input id="name" name="name" required placeholder="John Doe" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                    Phone
                  </label>
                  <input id="phone" name="phone" placeholder="+91 98765 43210" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
                    Service
                  </label>
                  <select id="service" name="service" className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Select a service
                    </option>
                    <option>Residential &amp; Commercial Construction</option>
                    <option>Turnkey (Design-Build) Contract</option>
                    <option>Structural Retrofitting &amp; Strengthening</option>
                    <option>Renovation &amp; Remodeling</option>
                    <option>Industrial &amp; Warehouse Construction</option>
                    <option>Architectural Design &amp; Planning</option>
                    <option>Project Planning &amp; Management</option>
                    <option>Civil &amp; Structural Consultancy</option>
                    <option>Quantity Estimate &amp; Costing</option>
                    <option>Site Management &amp; Coordination</option>
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about your project..."
                  className={inputClass}
                />
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
                Send Message
              </Button>
              {submitted && (
                <p className="mt-4 text-sm font-medium text-primary" role="status">
                  Thanks! We&apos;ve received your message and will be in touch soon.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-16">
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
                  "KAZI CONSTRUCTIONS, Suleman Nagar, Chintalmet, Hyderabad, Telangana 500052",
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
                    href="mailto:builders.kazi@gmail.com"
                    className="mt-2 block break-all text-white/90 transition-colors hover:text-gold"
                  >
                    builders.kazi@gmail.com
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
                  "KAZI CONSTRUCTIONS, Suleman Nagar, Chintalmet, Hyderabad, Telangana 500052",
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
