import { Target, Gem } from "lucide-react"
import { Reveal } from "@/components/reveal"

export function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="relative">
          <img
            src="/about-site.svg"
            alt="Kazi Constructions engineer reviewing detailed blueprints"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="absolute bottom-5 left-0 rounded-xl bg-navy/95 px-6 py-5 text-white shadow-xl backdrop-blur sm:left-5">
            <p className="font-heading text-lg italic text-gold">
              Principal-led since 1998
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Architecture &middot; Engineering &middot; Construction
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Who We Are
          </span>
          <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
            Building trust through{" "}
            <span className="font-normal italic text-primary">
              engineering excellence
            </span>
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Founded in 1998, Kazi Constructions is a principal-led architecture,
            engineering and construction firm dedicated to building landmarks
            that endure. We unite bold design vision with rigorous engineering
            discipline to deliver residential, commercial and civil projects of
            uncompromising quality &mdash; on time and on budget.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/60 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                Our Mission
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To turn our clients&apos; ambitions into landmarks through
                precision engineering, master craftsmanship and absolute
                transparency at every stage.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-card text-gold shadow-sm">
                <Gem className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                Our Vision
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To be the most trusted name in luxury construction &mdash;
                setting the regional benchmark for design integrity, structural
                excellence and sustainable building.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
