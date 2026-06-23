import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-accent text-accent-foreground">
      <img
        src="/placeholder.svg?height=900&width=1600&query=modern%20building%20construction%20site%20with%20cranes%20at%20dusk"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent/90 to-accent/40" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold backdrop-blur-sm">
          Trusted builders since 2004
        </span>
        <h1 className="max-w-3xl font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Build Your <span className="text-gold">Dream Home</span>
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-accent-foreground/70">
          From foundations to finishing touches, Kazi Constructions delivers
          residential, commercial, and renovation projects with precision
          engineering and uncompromising craftsmanship.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#projects" />}
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-accent-foreground/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
            nativeButton={false}
            render={<a href="#contact" />}
          >
            <Phone className="h-4 w-4" />
            Contact Us
          </Button>
        </div>

        <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-6 border-t border-accent-foreground/15 pt-8 sm:grid-cols-4">
          {[
            { value: "20+", label: "Years Experience" },
            { value: "450+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "120+", label: "Expert Team" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-heading text-3xl font-extrabold text-gold">{stat.value}</dt>
              <dd className="mt-1 text-sm text-accent-foreground/60">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
