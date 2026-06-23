import {
  Home,
  Building,
  Hammer,
  Sofa,
  TreePine,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react"

type Service = {
  icon: LucideIcon
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: Home,
    title: "Residential",
    description:
      "Custom homes, multi-family units, and additions built to your lifestyle with quality at every level.",
  },
  {
    icon: Building,
    title: "Commercial",
    description:
      "Offices, retail, and industrial facilities engineered for durability, efficiency, and brand impact.",
  },
  {
    icon: Hammer,
    title: "Renovation",
    description:
      "Breathe new life into existing spaces with structural upgrades, remodels, and full restorations.",
  },
  {
    icon: Sofa,
    title: "Interior",
    description:
      "Thoughtful interior fit-outs and finishes that balance form, function, and lasting comfort.",
  },
  {
    icon: TreePine,
    title: "Exterior",
    description:
      "Facades, landscaping, and hardscaping that boost curb appeal and protect your investment.",
  },
  {
    icon: ClipboardCheck,
    title: "Consultancy",
    description:
      "Expert planning, cost estimation, and project management to keep your build on track.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            What we do
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
            Comprehensive construction services
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One trusted partner for every stage of your project, from concept to
            completion.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
