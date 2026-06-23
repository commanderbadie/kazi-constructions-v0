import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "450+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "120+", label: "Expert Team" },
]

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-accent text-accent-foreground"
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-gold backdrop-blur-sm">
            Architects · Engineers · Consultant
          </span>
          <h1 className="font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance sm:text-6xl">
            Build Your <span className="text-gold">Dream Home</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-accent-foreground/75">
            Kazi Constructions delivers residential, commercial, and industrial
            projects with precision engineering, transparent costing, and
            uncompromising craftsmanship across Hyderabad.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<a href="#services" />}>
              Our Services
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
              Get a Quote
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-accent-foreground/15 bg-card shadow-2xl">
            <video
              className="aspect-square w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/kazi-logo.png"
            >
              <source src="/kazi-animation.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <div className="relative border-t border-accent-foreground/15">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 sm:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label}>
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
