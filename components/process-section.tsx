import { Reveal } from "@/components/reveal"

type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: "01",
    title: "Consult & Discover",
    description:
      "We listen to your goals, study the site and define a clear brief and budget.",
  },
  {
    number: "02",
    title: "Design & Engineer",
    description:
      "Architects and engineers develop integrated, buildable designs in tandem.",
  },
  {
    number: "03",
    title: "Build & Craft",
    description:
      "Master site teams construct with precision, safety and relentless quality control.",
  },
  {
    number: "04",
    title: "Deliver & Support",
    description:
      "We hand over a flawless project and stand behind it with lasting aftercare.",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="bg-navy py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            How We Work
          </span>
          <h2 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            A disciplined path{" "}
            <span className="font-normal italic text-gold">
              from vision to handover
            </span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <div className="border-t border-white/15 pt-8">
                <p className="font-heading text-4xl font-extrabold text-gold">
                  {step.number}
                </p>
                <h3 className="mt-6 font-heading text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
