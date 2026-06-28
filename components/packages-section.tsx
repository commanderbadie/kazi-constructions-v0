"use client"

import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/lib/use-site-content"

// Strip a trailing "( ... )" qualifier (e.g. "Basic ( Excl GST )") for a clean
// card title; the qualifier is shown as a small caption instead.
function cleanTier(name: string) {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim()
}

export function PackagesSection() {
  const { packages } = useSiteContent()
  const { tiers, homeTypes } = packages
  const base = homeTypes[0]

  // Highlight the second-from-top tier as "Most popular" when there are 4.
  const popularIdx = tiers.length >= 4 ? tiers.length - 2 : -1

  return (
    <section id="packages" className="bg-navy py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Our Packages
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            Transparent pricing for{" "}
            <span className="font-normal italic text-gold">every build</span>
          </h2>
          <p className="mt-5 leading-relaxed text-white/70">
            All-inclusive packages with quality materials at every tier. Pick
            the fit for your home and budget — full specifications compared side
            by side.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => {
            const popular = i === popularIdx
            return (
              <Reveal key={tier} delay={i * 100}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1 ${
                    popular
                      ? "border-gold bg-white/[0.06] shadow-lg"
                      : "border-white/15 bg-white/[0.03]"
                  }`}
                >
                  {popular && (
                    <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-extrabold">
                    {cleanTier(tier)}
                  </h3>
                  <div className="mt-3">
                    <span className="text-[11px] uppercase tracking-wide text-white/50">
                      Starting at
                    </span>
                    <p className="font-heading text-2xl font-extrabold text-gold">
                      {base?.perSqft[i] ?? ""}
                    </p>
                    <span className="text-xs text-white/50">per sqft</span>
                  </div>
                  <a
                    href="/packages"
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-gold"
                  >
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Button
            size="lg"
            nativeButton={false}
            className="h-auto rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
            render={<a href="/packages" />}
          >
            View full comparison
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
