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

        <div className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="font-heading text-lg font-bold uppercase tracking-tight">
              Visit our office
            </h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <iframe
              title="Kazi Constructions office location on Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                "Wadi-E-Mahmood, Suleman Nagar, Rajendra Nagar, Hyderabad 500052",
              )}&z=15&output=embed`}
              width="100%"
              height="400"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}
