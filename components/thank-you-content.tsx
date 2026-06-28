"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

type Question = {
  id: string
  label: string
  options: string[]
  help?: string
}

const QUESTIONS: Question[] = [
  {
    id: "timeline",
    label: "When are you planning to start construction?",
    options: ["< 3 Months", "3 – 6 Months", "6 Months +"],
  },
  {
    id: "budget",
    label: "What is your construction budget estimate?",
    options: ["Below ₹25L", "₹25L – ₹50L", "₹50L & above"],
  },
  {
    id: "registered",
    label: "Is your plot registered?",
    options: ["Yes", "No"],
    help: 'Select "Yes" if you have registration documents from the Sub-Registrar\'s office. These are typically required for loans and approvals.',
  },
]

export function ThankYouContent() {
  const params = useSearchParams()
  const name = params.get("name")?.trim() || ""
  const firstName = name.split(/\s+/)[0] || ""

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const allAnswered = QUESTIONS.every((q) => answers[q.id])

  function select(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Front-end only — qualifying answers stay client-side for now.
    setDone(true)
  }

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
      {/* Faint blueprint backdrop for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/blueprint-grid.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {done ? <SuccessCard /> : (
          <QuestionnaireCard
            firstName={firstName}
            answers={answers}
            onSelect={select}
            onSubmit={handleSubmit}
            allAnswered={allAnswered}
          />
        )}
      </div>
    </section>
  )
}

function QuestionnaireCard({
  firstName,
  answers,
  onSelect,
  onSubmit,
  allAnswered,
}: {
  firstName: string
  answers: Record<string, string>
  onSelect: (id: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  allAnswered: boolean
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="animate-fade-blur rounded-3xl border border-border bg-card p-6 text-left shadow-2xl sm:p-9"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
        Request received
      </span>

      <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
        {firstName ? `Almost there, ${firstName}! ` : ""}Book your{" "}
        <span className="text-gold">FREE expert meeting</span> in 3 quick steps
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        A few quick details help our team prepare the right plan before we call
        you.
      </p>

      <div className="mt-8 space-y-7">
        {QUESTIONS.map((q) => (
          <fieldset key={q.id}>
            <legend className="font-heading text-base font-bold text-foreground">
              {q.label}
            </legend>
            <div
              className={`mt-3 grid gap-3 ${
                q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
              }`}
            >
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onSelect(q.id, opt)}
                    aria-pressed={selected}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary/5 font-semibold text-primary shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    {selected && <Check className="h-4 w-4" />}
                    {opt}
                  </button>
                )
              })}
            </div>
            {q.help && (
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                {q.help}
              </p>
            )}
          </fieldset>
        ))}
      </div>

      <Button
        type="submit"
        disabled={!allAnswered}
        className="mt-9 h-auto w-full rounded-xl bg-primary px-6 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Book Free Consultation
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {allAnswered
          ? "By submitting, you agree to our privacy policy."
          : "Please answer all three questions to continue."}
      </p>
    </form>
  )
}

function SuccessCard() {
  return (
    <div className="animate-fade-blur rounded-3xl border border-border bg-card p-8 text-center shadow-2xl sm:p-12">
      {/* Animated gold success check */}
      <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center">
        <span
          aria-hidden="true"
          className="kazi-success-ring absolute inset-0 rounded-full border border-gold/50"
        />
        <span className="kazi-success-icon flex h-24 w-24 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-11 w-11 text-gold"
            aria-hidden="true"
          >
            <path className="kazi-check-path" d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      </div>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Thank you for submitting the form!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        Our team will contact you soon to schedule your meeting. At Kazi
        Constructions, we&apos;re committed to making your build simple,
        transparent, and reliable — every step of the way.
      </p>

      <div className="mx-auto mt-9 flex max-w-sm flex-col gap-3">
        <a
          href="/#services"
          className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-muted"
        >
          Explore our Services
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="/#testimonials"
          className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-muted"
        >
          Hear from Our Customers
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  )
}
