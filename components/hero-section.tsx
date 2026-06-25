"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/lib/use-site-content"

export function HeroSection() {
  const { hero } = useSiteContent()
  const stats = hero.stats
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (prefersReduced) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setOffset(window.scrollY))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-accent text-accent-foreground"
    >
      {/* Subtle parallax background layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.07]"
        style={{
          backgroundImage: "url(/blueprint-grid.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translate3d(0, ${offset * 0.18}px, 0) scale(1.1)`,
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-28 lg:pt-36">
        <div
          className="animate-scale-in relative order-1"
          style={{ animationDelay: "0.3s" }}
        >
          <div
            className="overflow-hidden rounded-2xl border-2 border-gold shadow-2xl"
            style={{
              boxShadow:
                "0 0 0 1px var(--gold), 0 0 24px 2px color-mix(in oklch, var(--gold) 55%, transparent), 0 0 48px 6px color-mix(in oklch, var(--gold) 30%, transparent)",
            }}
          >
            <img
              src="/kazi-logo-hero.png"
              alt="Kazi Constructions — Architects, Engineers, Consultants"
              className="block w-full scale-[1.14]"
            />
          </div>
        </div>

        <div className="order-2 flex flex-col gap-7">
          <span
            className="animate-fade-blur inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold backdrop-blur-sm sm:text-sm"
            style={{ animationDelay: "0.1s" }}
          >
            {hero.badge}
          </span>
          <h1
            className="animate-fade-blur font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s" }}
          >
            <span className="block">{hero.titleLine1}</span>
            <span className="block text-gold">{hero.titleHighlight}</span>
          </h1>
          <p
            className="animate-fade-blur max-w-xl text-lg leading-relaxed text-accent-foreground/75"
            style={{ animationDelay: "0.45s" }}
          >
            {hero.paragraph}
          </p>
          <div
            className="animate-fade-blur flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.65s" }}
          >
            <Button
              size="lg"
              className="h-auto rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide"
              nativeButton={false}
              render={<a href="#services" />}
            >
              Our Services
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-auto rounded-full border-accent-foreground/40 bg-transparent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
              nativeButton={false}
              render={<a href="#contact" />}
            >
              <Phone className="h-4 w-4" />
              Get a Quote
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-accent-foreground/15">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 sm:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="animate-fade-blur"
              style={{ animationDelay: `${0.8 + i * 0.12}s` }}
            >
              <dt className="font-heading text-3xl font-extrabold text-gold">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-accent-foreground/60">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
