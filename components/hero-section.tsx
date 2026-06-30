"use client"

import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/lib/use-site-content"

export function HeroSection() {
  const { hero } = useSiteContent()
  const stats = hero.stats

  return (
    <section
      id="home"
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: "url(/hero-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay — just enough for text readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-navy/60"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-28 lg:pt-36">
        {/* Logo / 3D visual */}
        <div
          className="animate-scale-in relative order-1"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="kazi-logo-fx relative">
            <img
              src="/hero-3d.png"
              alt="Kazi Constructions — Architects, Engineers, Consultants"
              className="kazi-logo-img block w-full"
            />
            <span aria-hidden="true" className="kazi-border" />
          </div>
        </div>

        {/* Text content */}
        <div className="order-2 flex flex-col gap-7">
          <span
            className="animate-fade-blur inline-flex w-fit items-center gap-2 rounded-full border border-gold/60 bg-black/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold backdrop-blur-sm sm:text-sm"
            style={{ animationDelay: "0.1s" }}
          >
            {hero.badge}
          </span>
          <h1
            className="animate-fade-blur font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            <span className="block text-white">{hero.titleLine1}</span>
            <span className="block text-gold drop-shadow-lg">{hero.titleHighlight}</span>
          </h1>
          <p
            className="animate-fade-blur max-w-xl text-lg font-medium leading-relaxed text-white/90"
            style={{ animationDelay: "0.45s", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            {hero.paragraph}
          </p>
          <div
            className="animate-fade-blur flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.65s" }}
          >
            <Button
              size="lg"
              className="h-auto rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide shadow-lg"
              nativeButton={false}
              render={<a href="#services" />}
            >
              Our Services
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-auto rounded-full border-white/50 bg-black/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={<a href="#contact" />}
            >
              <Phone className="h-4 w-4" />
              Get a Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/15 bg-navy/40 backdrop-blur-sm">
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
              <dd className="mt-1 text-sm text-white/70">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
