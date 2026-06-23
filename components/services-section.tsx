import {
  Home,
  Building2,
  Hammer,
  Paintbrush,
  TrafficCone,
  Compass,
  type LucideIcon,
} from "lucide-react"
import { Reveal } from "@/components/reveal"

type Service = {
  icon: LucideIcon
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: Home,
    title: "Residential Construction",
    description:
      "Custom homes, villas, and apartments built with precision craftsmanship and lasting quality.",
  },
  {
    icon: Building2,
    title: "Commercial Construction",
    description:
      "Offices, retail, and mixed-use developments engineered for performance and durability.",
  },
  {
    icon: Hammer,
    title: "Renovation & Remodeling",
    description:
      "Transform existing spaces with structural upgrades, modern remodels, and restorations.",
  },
  {
    icon: Paintbrush,
    title: "Interior & Exterior Works",
    description:
      "Complete finishing, facade, and interior fit-outs that bring every space to life.",
  },
  {
    icon: TrafficCone,
    title: "Infrastructure Projects",
    description:
      "Roads, drainage, and large-scale civil works delivered to exacting engineering standards.",
  },
  {
    icon: Compass,
    title: "Engineering Consultancy",
    description:
      "Expert civil and structural analysis, design, and certification you can rely on.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            What we do
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One trusted partner for every stage of your project, from concept to
            completion.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 100}>
              <article className="group h-full rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-primary hover:shadow-xl hover:shadow-primary/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-balance">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
