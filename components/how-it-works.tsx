"use client"

import { useState } from "react"
import { ArrowRight, Phone, Pencil, CalendarCheck, PenTool, TrendingUp, Home } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useSiteContent } from "@/lib/use-site-content"

type Step = {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    number: "01",
    title: "Raise a Request",
    description:
      "Raise a house construction service request or call us. Our team will get in touch with you to understand your requirements in more detail.",
    icon: <Phone className="h-5 w-5" />,
  },
  {
    number: "02",
    title: "Meet our Expert",
    description:
      "Our construction expert visits your site, understands your vision, evaluates feasibility, and provides a transparent cost estimate tailored to your needs.",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    number: "03",
    title: "Book with Us",
    description:
      "Once you're satisfied with the proposal, book your project with a nominal booking amount. We'll begin planning and scheduling immediately.",
    icon: <Pencil className="h-5 w-5" />,
  },
  {
    number: "04",
    title: "Receive Designs",
    description:
      "Our architects and engineers prepare detailed floor plans, 3D elevations, structural drawings, and MEP layouts — all customised to your requirements.",
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    number: "05",
    title: "Track & Transact",
    description:
      "Stay updated with real-time project progress. Transparent billing at every stage — you pay as we build, with complete visibility into costs and timelines.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    number: "06",
    title: "Settle In",
    description:
      "After final inspection and quality checks, we hand over the keys to your dream home — built to perfection, on time, and within budget.",
    icon: <Home className="h-5 w-5" />,
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const { contact } = useSiteContent()

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Our house construction steps are simple and easy to understand:{" "}
            <span className="font-semibold text-foreground">
              Plan &ndash; Build &ndash; Track &ndash; Settle in.
            </span>
          </p>
        </Reveal>

        {/* Timeline Steps */}
        <Reveal className="mt-12">
          <div className="relative flex items-center justify-between">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden sm:block">
              <div className="mx-auto h-[2px] w-full border-t-2 border-dashed border-muted-foreground/30" />
            </div>

            {/* Step circles */}
            <div className="relative flex w-full items-start justify-between gap-2 sm:gap-0">
              {steps.map((step, i) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className="group flex flex-col items-center gap-2 sm:gap-3"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 sm:h-12 sm:w-12 sm:text-base ${
                      i === activeStep
                        ? "border-gold bg-gold text-gold-foreground scale-110 shadow-lg shadow-gold/30"
                        : i < activeStep
                          ? "border-gold/60 bg-gold/10 text-gold"
                          : "border-muted-foreground/30 bg-background text-muted-foreground hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`hidden text-center text-xs font-semibold transition-colors sm:block sm:max-w-[100px] lg:max-w-none lg:text-sm ${
                      i === activeStep
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Active Step Detail Card */}
        <Reveal className="mt-10 sm:mt-14">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-8 lg:p-10">
              {/* Left: Step info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                    {steps[activeStep].icon}
                  </span>
                  <span className="font-heading text-sm font-bold uppercase tracking-wider text-gold">
                    Step {steps[activeStep].number}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-xl font-extrabold text-foreground sm:text-2xl">
                  {steps[activeStep].title}
                </h3>
                <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Right: CTA */}
              <div className="shrink-0">
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                  Let&apos;s Build
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-muted">
              <div
                className="h-full bg-gold transition-all duration-500 ease-out"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </Reveal>

        {/* Bottom link */}
        <Reveal className="mt-8 flex justify-center">
          <a
            href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
