const projects = [
  {
    title: "Hillcrest Family Residence",
    category: "Residential",
    image: "/modern-luxury-house-exterior.png",
  },
  {
    title: "Summit Business Tower",
    category: "Commercial",
    image: "/modern-glass-office-tower.png",
  },
  {
    title: "Heritage Loft Renovation",
    category: "Renovation",
    image: "/renovated-industrial-loft-interior.jpg",
  },
  {
    title: "Lakeview Villas",
    category: "Residential",
    image: "/luxury-villa-with-pool.png",
  },
  {
    title: "Metro Retail Plaza",
    category: "Commercial",
    image: "/modern-retail-shopping-plaza.jpg",
  },
  {
    title: "Aspen Interior Suite",
    category: "Interior",
    image: "/modern-luxury-interior-living-room.jpg",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our portfolio
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
              Featured projects
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            A selection of recent builds showcasing our range, quality, and
            attention to detail.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group relative overflow-hidden rounded-xl border border-border"
            >
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {project.category}
                </span>
                <h3 className="mt-1 font-heading text-lg font-bold text-accent-foreground">
                  {project.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
