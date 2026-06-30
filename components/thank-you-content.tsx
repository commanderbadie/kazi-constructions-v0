"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/lib/use-site-content"

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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export function ThankYouContent() {
  const params = useSearchParams()
  const { contact } = useSiteContent()
  const name = params.get("name")?.trim() || ""
  const firstName = name.split(/\s+/)[0] || ""
  const ref = params.get("ref")?.trim() || ""

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const allAnswered = QUESTIONS.every((q) => answers[q.id])

  function select(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Persist the qualifying answers onto the existing lead (matched by ref).
    if (ref) {
      try {
        void fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            action: "qualify",
            ref,
            timeline: answers.timeline,
            budget: answers.budget,
            registered: answers.registered,
          }),
        })
      } catch {
        // Non-fatal — still show the success state.
      }
    }

    setDone(true)
  }

  // Pre-fill a WhatsApp message so the owner can match it to this lead at a
  // glance, and so the act of sending it confirms a real, reachable number.
  const waSummary = [
    answers.budget && `Budget: ${answers.budget}`,
    answers.timeline && `Start: ${answers.timeline}`,
    answers.registered && `Plot registered: ${answers.registered}`,
  ]
    .filter(Boolean)
    .join(", ")
  const waText =
    `Hi, I'm ${name || "a visitor"}` +
    (ref ? ` (Ref ${ref})` : "") +
    `. I'd like to book my free consultation.` +
    (waSummary ? ` ${waSummary}.` : "")
  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(waText)}`

  function onWhatsAppClick() {
    if (!ref) return
    try {
      void fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ action: "whatsapp_clicked", ref }),
      })
    } catch {
      // Non-fatal
    }
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
        {done ? (
          <SuccessCard whatsappHref={whatsappHref} onWhatsAppClick={onWhatsAppClick} />
        ) : (
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

function SuccessCard({
  whatsappHref,
  onWhatsAppClick,
}: {
  whatsappHref: string
  onWhatsAppClick: () => void
}) {
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
        One last step — confirm on WhatsApp so we can lock your slot and reply
        faster. It only takes a second.
      </p>

      {/* Primary CTA — WhatsApp confirmation (verifies a real, reachable number) */}
      <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsAppClick}
          className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#1ebe5a] hover:shadow-lg"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Confirm on WhatsApp
        </a>
        <p className="text-xs text-muted-foreground">
          Recommended — get a priority response from our team.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 border-t border-border pt-7">
        <a
          href="/packages"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
        >
          View Our Packages
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
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
