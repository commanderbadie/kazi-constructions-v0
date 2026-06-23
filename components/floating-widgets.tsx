"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"

const WHATSAPP_NUMBER = "918801958508"
const WHATSAPP_MESSAGE =
  "Hello Kazi Constructions! I'd like to enquire about your construction services."

type ChatMessage = { from: "bot" | "user"; text: string }

type Faq = { label: string; answer: string }

const faqs: Faq[] = [
  {
    label: "What services do you offer?",
    answer:
      "We handle residential & commercial construction, turnkey design-build, renovation & remodeling, industrial & warehouse builds, architectural design, project management, and civil/structural consultancy.",
  },
  {
    label: "How do I get a quote?",
    answer:
      "Fill out the 'Get in touch' form in our Contact section with your project details, or message us on WhatsApp — we'll reply with a free, no-obligation quote.",
  },
  {
    label: "How can I contact you?",
    answer:
      "Call us at +91 8801958508, email builders.kazi@gmail.com, or find us on Instagram @kazi_constructions. We're based in Rajendra Nagar, Hyderabad.",
  },
  {
    label: "Where are you located?",
    answer:
      "4-25-2/3/3, Wadi-E-Mahmood, Suleman Nagar, Rajendra Nagar, PVNR Pillar No.242, Hyderabad - 500052.",
  },
]

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hi! I'm the Kazi Constructions assistant. How can I help you today?",
    },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, chatOpen])

  function askFaq(faq: Faq) {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.label },
      { from: "bot", text: faq.answer },
    ])
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chatbot panel */}
      {chatOpen && (
        <div className="animate-scale-in flex h-[28rem] w-[20rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[22rem]">
          <div className="flex items-center gap-3 bg-accent px-4 py-3 text-accent-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-gold-foreground">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">Kazi Assistant</p>
              <p className="text-[11px] text-accent-foreground/70">
                Typically replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="ml-auto rounded-md p-1 text-accent-foreground/80 transition-colors hover:bg-accent-foreground/10 hover:text-accent-foreground"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <p
                  className={
                    m.from === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2 text-sm text-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-card p-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-2">
              {faqs.map((faq) => (
                <button
                  key={faq.label}
                  type="button"
                  onClick={() => askFaq(faq)}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-left text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {faq.label}
                </button>
              ))}
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col items-end gap-3">
        {/* WhatsApp button with pulse */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire on WhatsApp"
          className="group/wa relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_28px_6px_rgba(37,211,102,0.7)]"
          style={{ boxShadow: "0 0 18px 3px rgba(37,211,102,0.55)" }}
        >
          <span className="pulse-ring absolute inset-0 rounded-full bg-[#25D366]" aria-hidden="true" />
          <WhatsAppIcon className="relative h-7 w-7" />
        </a>

        {/* Chatbot toggle */}
        <button
          type="button"
          onClick={() => setChatOpen((v) => !v)}
          aria-label={chatOpen ? "Close assistant" : "Open assistant"}
          aria-expanded={chatOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-1 ring-gold/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_28px_6px_color-mix(in_oklch,var(--gold)_70%,transparent)]"
          style={{
            boxShadow:
              "0 0 18px 3px color-mix(in oklch, var(--gold) 55%, transparent)",
          }}
        >
          {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </div>
  )
}
