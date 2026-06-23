import { MapPin } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { ProjectImage } from "@/components/project-image"

type Project = {
  title: string
  category: string
  location: string
  description: string
  image: string
}

const projects: Project[] = [
  {
    title: "Hillcrest Family Residence",
    category: "Residential",
    location: "Rajendra Nagar, Hyderabad",
    description:
      "A modern 4-bedroom villa with open-plan living, completed turnkey from design to handover.",
    image: "/projects/residential-villa.svg",
  },
  {
    title: "Summit Business Tower",
    category: "Commercial",
    location: "Gachibowli, Hyderabad",
    description:
      "A 12-storey glass office tower built with structural steel and energy-efficient facades.",
    image: "/projects/commercial-tower.svg",
  },
  {
    title: "Heritage Loft Renovation",
    category: "Renovation",
    location: "Attapur, Hyderabad",
    description:
      "Full structural retrofit and interior remodel transforming an old warehouse into loft living.",
    image: "/projects/renovation-loft.svg",
  },
  {
    title: "Lakeview Villas",
    category: "Residential",
    location: "Shamshabad, Hyderabad",
    description:
      "A gated community of premium villas with landscaped pools and contemporary architecture.",
    image: "/projects/lakeview-villas.svg",
  },
  {
    title: "Metro Retail Plaza",
    category: "Commercial",
    location: "Mehdipatnam, Hyderabad",
    description:
      "A multi-level retail and dining plaza delivered on schedule with full site coordination.",
    image: "/projects/retail-plaza.svg",
  },
  {
    title: "Aspen Interior Suite",
    category: "Interior",
    location: "Banjara Hills, Hyderabad",
    description:
      "Bespoke interior fit-out featuring custom joinery, lighting design, and premium finishes.",
    image: "/projects/interior-suite.svg",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our portfolio
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
              Featured Projects
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            A selection of recent builds showcasing our range, quality, and
            attention to detail.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 120}>
              <article className="group h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
                <div className="relative overflow-hidden">
                  <ProjectImage src={project.image} alt={project.title} />
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {project.location}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
