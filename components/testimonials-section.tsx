"use client"

import { Star, Quote } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useSiteContent } from "@/lib/use-site-content"

export function TestimonialsSection() {
  const { testimonials } = useSiteContent()

  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Client Voices
            </span>
            <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
              Trusted by those who{" "}
              <span className="font-normal italic text-primary">
                demand the best
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 100}>
              <figure className="relative h-full rounded-2xl border border-white/50 bg-white/70 p-8 shadow-sm backdrop-blur-md">
                <Quote
                  className="absolute right-6 top-6 h-9 w-9 text-gold/25"
                  aria-hidden="true"
                />
                <div className="flex gap-1 text-gold" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-5 italic leading-relaxed text-foreground/80">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {item.initials}
                  </span>
                  <span>
                    <span className="block font-bold text-foreground">
                      {item.name}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {item.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
