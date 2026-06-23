import {
  Building2,
  Handshake,
  ShieldCheck,
  Hammer,
  Factory,
  Ruler,
  ClipboardList,
  Compass,
  Calculator,
  HardHat,
  type LucideIcon,
} from "lucide-react"

type Service = {
  icon: LucideIcon
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: Building2,
    title: "Residential & Commercial Building Construction",
    description:
      "End-to-end construction of homes, apartments, and commercial buildings built to last.",
  },
  {
    icon: Handshake,
    title: "Turnkey Construction Contracts (Design-Build)",
    description:
      "Single-point responsibility from design through handover for a hassle-free build.",
  },
  {
    icon: ShieldCheck,
    title: "Structural Retrofitting & Strengthening",
    description:
      "Reinforce and upgrade existing structures for safety, compliance, and longevity.",
  },
  {
    icon: Hammer,
    title: "Building Renovation & Remodeling",
    description:
      "Transform existing spaces with structural upgrades, remodels, and restorations.",
  },
  {
    icon: Factory,
    title: "Industrial & Warehouse Construction",
    description:
      "Durable, efficient industrial sheds and warehouses engineered for heavy use.",
  },
  {
    icon: Ruler,
    title: "Architectural Design & Space Planning",
    description:
      "Functional, aesthetic layouts that make the most of every square foot.",
  },
  {
    icon: ClipboardList,
    title: "Project Planning & Management",
    description:
      "Detailed scheduling and coordination to keep your project on time and on budget.",
  },
  {
    icon: Compass,
    title: "Civil & Structural Engineering Consultancy",
    description:
      "Expert engineering analysis, design, and certification you can rely on.",
  },
  {
    icon: Calculator,
    title: "Quantity Estimate & Costing",
    description:
      "Accurate BOQs and cost estimates for transparent, predictable budgeting.",
  },
  {
    icon: HardHat,
    title: "Site Management & Coordination",
    description:
      "On-site supervision and vendor coordination for smooth, quality execution.",
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
            Our Services
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
              <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-balance">
                {service.title}
              </h3>
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
