"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const details = [
  { icon: MapPin, label: "Address", value: "124 Builder's Avenue, Nairobi, Kenya" },
  { icon: Phone, label: "Phone", value: "+254 700 123 456" },
  { icon: Mail, label: "Email", value: "hello@kaziconstructions.com" },
  { icon: Clock, label: "Hours", value: "Mon – Sat, 8:00 AM – 6:00 PM" },
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
                  <input id="phone" name="phone" placeholder="+254 700 000 000" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
                    Service
                  </label>
                  <select id="service" name="service" className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Select a service
                    </option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Renovation</option>
                    <option>Interior</option>
                    <option>Exterior</option>
                    <option>Consultancy</option>
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
      </div>
    </section>
  )
}
