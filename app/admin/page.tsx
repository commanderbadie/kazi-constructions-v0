"use client"

import { useEffect, useMemo, useState } from "react"
import {
  defaultContent,
  type SiteContent,
  type ServiceIcon,
  type ProjectGallery,
} from "@/lib/site-content"
import {
  readStoredContent,
  saveContent,
  resetContent,
  exportContentJson,
  importContentJson,
} from "@/lib/use-site-content"
import { AdminPanelProjects } from "@/components/admin-panel-projects"
import { AdminPanelDocuments } from "@/components/admin-panel-documents"
import { AdminPanelLeads } from "@/components/admin-panel-leads"
import { AdminPanelMessages } from "@/components/admin-panel-messages"

// Access to this page is protected by real server-side auth (see middleware.ts
// and /api/admin/login). By the time this component renders, the request has
// already passed the session check, so there's no client-side gate here.

type SectionId =
  | "company"
  | "contact"
  | "hero"
  | "about"
  | "services"
  | "testimonials"
  | "projects"
  | "faqs"
  | "customerProjects"
  | "customerDocuments"
  | "leads"
  | "messages"

const SECTIONS: { id: SectionId; label: string; hint: string }[] = [
  { id: "company", label: "Company", hint: "Name, tagline, footer blurb" },
  { id: "contact", label: "Contact", hint: "Phone, email, address, socials" },
  { id: "hero", label: "Hero", hint: "Headline & top stats" },
  { id: "about", label: "About", hint: "Mission, vision, counters" },
  { id: "services", label: "Services", hint: "Service cards" },
  { id: "testimonials", label: "Testimonials", hint: "Client quotes" },
  { id: "projects", label: "Projects", hint: "Portfolio cards" },
  { id: "faqs", label: "FAQs", hint: "Chat assistant answers" },
  {
    id: "customerProjects",
    label: "Customer Projects",
    hint: "Track customer builds",
  },
  {
    id: "customerDocuments",
    label: "Customer Documents",
    hint: "Share quotes & files",
  },
  { id: "leads", label: "Leads", hint: "Popup submissions" },
  { id: "messages", label: "Messages", hint: "Customer support inbox" },
]

const ICON_OPTIONS: ServiceIcon[] = [
  "home",
  "building",
  "hammer",
  "paintbrush",
  "cone",
  "compass",
]

const GALLERY_OPTIONS: ProjectGallery[] = ["none", "interior", "circulation"]

/* ----------------------------- UI primitives ----------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

function Card({
  children,
  onRemove,
  title,
}: {
  children: React.ReactNode
  onRemove?: () => void
  title?: string
}) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      {(title || onRemove) && (
        <div className="mb-3 flex items-center justify-between">
          {title && (
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {title}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Remove
            </button>
          )}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900"
    >
      + {label}
    </button>
  )
}

/* ------------------------------- Passcode -------------------------------- */

/* -------------------------------- Editor --------------------------------- */

export default function AdminPage() {
  const [ready, setReady] = useState(false)
  const [draft, setDraft] = useState<SiteContent>(defaultContent)
  const [savedSnapshot, setSavedSnapshot] = useState<string>(
    JSON.stringify(defaultContent),
  )
  const [section, setSection] = useState<SectionId>("company")
  const [toast, setToast] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importText, setImportText] = useState("")

  useEffect(() => {
    const stored = readStoredContent()
    setDraft(stored)
    setSavedSnapshot(JSON.stringify(stored))
    setReady(true)
  }, [])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== savedSnapshot,
    [draft, savedSnapshot],
  )

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  function handleSave() {
    saveContent(draft)
    setSavedSnapshot(JSON.stringify(draft))
    flash("Saved. Your changes are now live in this browser.")
  }

  function handleReset() {
    if (
      !window.confirm(
        "Reset all content back to the original defaults? This clears your saved edits in this browser.",
      )
    )
      return
    resetContent()
    setDraft(defaultContent)
    setSavedSnapshot(JSON.stringify(defaultContent))
    flash("Content reset to defaults.")
  }

  function handleExport() {
    const blob = new Blob([exportContentJson(draft)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "kazi-site-content.json"
    a.click()
    URL.revokeObjectURL(url)
    flash("Exported kazi-site-content.json")
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(exportContentJson(draft))
      flash("Content JSON copied to clipboard.")
    } catch {
      flash("Couldn't copy — try the Download button instead.")
    }
  }

  function handleImport() {
    try {
      const next = importContentJson(importText)
      setDraft(next)
      setImporting(false)
      setImportText("")
      flash("Imported. Review, then press Save to apply.")
    } catch {
      flash("That doesn't look like valid content JSON.")
    }
  }

  async function logout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } catch {
      // even if the request fails, send them to the login screen
    }
    window.location.assign("/admin/login")
  }

  // Helpers to update nested draft immutably.
  function patch<K extends keyof SiteContent>(
    key: K,
    value: SiteContent[K],
  ) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto flex items-center gap-3">
            <span className="font-heading text-lg font-extrabold">
              Kazi Admin
            </span>
            {dirty ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                Unsaved changes
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                All saved
              </span>
            )}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View site ↗
          </a>
          <button
            type="button"
            onClick={() => setImporting(true)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Import
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Copy JSON
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Download
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-700"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* How-it-works banner */}
      <div className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-6xl px-4 py-2.5 text-xs leading-relaxed text-amber-800">
          Edits are saved in <strong>your browser</strong> and appear instantly
          on the site for you. To publish them for <strong>everyone</strong>,
          press <strong>Download</strong> (or <strong>Copy JSON</strong>) and
          send the file to your developer to commit — that's how this static
          site goes live for all visitors.
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[210px_1fr]">
        {/* Sidebar */}
        <nav className="flex flex-row flex-wrap gap-2 md:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`rounded-lg px-3 py-2.5 text-left text-sm transition md:w-full ${
                section === s.id
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="block font-semibold">{s.label}</span>
              <span
                className={`hidden text-xs md:block ${
                  section === s.id ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {s.hint}
              </span>
            </button>
          ))}
        </nav>

        {/* Editor panel */}
        <main className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {section === "company" && (
            <Section title="Company">
              <Field
                label="Company name"
                value={draft.company.name}
                onChange={(v) =>
                  patch("company", { ...draft.company, name: v })
                }
              />
              <Field
                label="Tagline"
                value={draft.company.tagline}
                onChange={(v) =>
                  patch("company", { ...draft.company, tagline: v })
                }
              />
              <TextArea
                label="Footer blurb"
                value={draft.company.footerBlurb}
                onChange={(v) =>
                  patch("company", { ...draft.company, footerBlurb: v })
                }
              />
            </Section>
          )}

          {section === "contact" && (
            <Section title="Contact & Socials">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Phone (display)"
                  value={draft.contact.phoneDisplay}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, phoneDisplay: v })
                  }
                />
                <Field
                  label="Phone (tel: link)"
                  value={draft.contact.phoneRaw}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, phoneRaw: v })
                  }
                />
                <Field
                  label="WhatsApp number (digits only)"
                  value={draft.contact.whatsappNumber}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, whatsappNumber: v })
                  }
                />
                <Field
                  label="Email"
                  value={draft.contact.email}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, email: v })
                  }
                />
              </div>
              <TextArea
                label="WhatsApp pre-filled message"
                value={draft.contact.whatsappMessage}
                rows={2}
                onChange={(v) =>
                  patch("contact", { ...draft.contact, whatsappMessage: v })
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Address line 1"
                  value={draft.contact.addressLine1}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, addressLine1: v })
                  }
                />
                <Field
                  label="Address line 2"
                  value={draft.contact.addressLine2}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, addressLine2: v })
                  }
                />
              </div>
              <Field
                label="Short address (footer)"
                value={draft.contact.shortAddress}
                onChange={(v) =>
                  patch("contact", { ...draft.contact, shortAddress: v })
                }
              />
              <Field
                label="Map search address"
                value={draft.contact.mapAddress}
                onChange={(v) =>
                  patch("contact", { ...draft.contact, mapAddress: v })
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Office hours (weekday)"
                  value={draft.contact.officeHoursWeekday}
                  onChange={(v) =>
                    patch("contact", {
                      ...draft.contact,
                      officeHoursWeekday: v,
                    })
                  }
                />
                <Field
                  label="Office hours (Saturday)"
                  value={draft.contact.officeHoursSaturday}
                  onChange={(v) =>
                    patch("contact", {
                      ...draft.contact,
                      officeHoursSaturday: v,
                    })
                  }
                />
                <Field
                  label="Instagram URL"
                  value={draft.contact.instagramUrl}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, instagramUrl: v })
                  }
                />
                <Field
                  label="LinkedIn URL"
                  value={draft.contact.linkedinUrl}
                  onChange={(v) =>
                    patch("contact", { ...draft.contact, linkedinUrl: v })
                  }
                />
              </div>
            </Section>
          )}

          {section === "hero" && (
            <Section title="Hero">
              <Field
                label="Badge"
                value={draft.hero.badge}
                onChange={(v) => patch("hero", { ...draft.hero, badge: v })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Title line 1"
                  value={draft.hero.titleLine1}
                  onChange={(v) =>
                    patch("hero", { ...draft.hero, titleLine1: v })
                  }
                />
                <Field
                  label="Title highlight (gold)"
                  value={draft.hero.titleHighlight}
                  onChange={(v) =>
                    patch("hero", { ...draft.hero, titleHighlight: v })
                  }
                />
              </div>
              <TextArea
                label="Intro paragraph"
                value={draft.hero.paragraph}
                onChange={(v) =>
                  patch("hero", { ...draft.hero, paragraph: v })
                }
              />
              <div className="pt-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Stats
                </p>
                <div className="space-y-3">
                  {draft.hero.stats.map((stat, i) => (
                    <Card
                      key={i}
                      title={`Stat ${i + 1}`}
                      onRemove={() =>
                        patch("hero", {
                          ...draft.hero,
                          stats: draft.hero.stats.filter((_, j) => j !== i),
                        })
                      }
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field
                          label="Value"
                          value={stat.value}
                          onChange={(v) =>
                            patch("hero", {
                              ...draft.hero,
                              stats: draft.hero.stats.map((s, j) =>
                                j === i ? { ...s, value: v } : s,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Label"
                          value={stat.label}
                          onChange={(v) =>
                            patch("hero", {
                              ...draft.hero,
                              stats: draft.hero.stats.map((s, j) =>
                                j === i ? { ...s, label: v } : s,
                              ),
                            })
                          }
                        />
                      </div>
                    </Card>
                  ))}
                  <AddButton
                    label="Add stat"
                    onClick={() =>
                      patch("hero", {
                        ...draft.hero,
                        stats: [
                          ...draft.hero.stats,
                          { value: "0+", label: "New stat" },
                        ],
                      })
                    }
                  />
                </div>
              </div>
            </Section>
          )}

          {section === "about" && (
            <Section title="About">
              <Field
                label="Section label"
                value={draft.about.label}
                onChange={(v) => patch("about", { ...draft.about, label: v })}
              />
              <Field
                label="Heading"
                value={draft.about.heading}
                onChange={(v) =>
                  patch("about", { ...draft.about, heading: v })
                }
              />
              <TextArea
                label="Body"
                rows={4}
                value={draft.about.body}
                onChange={(v) => patch("about", { ...draft.about, body: v })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextArea
                  label="Mission"
                  value={draft.about.mission}
                  onChange={(v) =>
                    patch("about", { ...draft.about, mission: v })
                  }
                />
                <TextArea
                  label="Vision"
                  value={draft.about.vision}
                  onChange={(v) =>
                    patch("about", { ...draft.about, vision: v })
                  }
                />
              </div>

              <div className="pt-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Highlights
                </p>
                <div className="space-y-2">
                  {draft.about.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={h}
                        onChange={(e) =>
                          patch("about", {
                            ...draft.about,
                            highlights: draft.about.highlights.map((x, j) =>
                              j === i ? e.target.value : x,
                            ),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          patch("about", {
                            ...draft.about,
                            highlights: draft.about.highlights.filter(
                              (_, j) => j !== i,
                            ),
                          })
                        }
                        className="shrink-0 rounded-md px-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <AddButton
                    label="Add highlight"
                    onClick={() =>
                      patch("about", {
                        ...draft.about,
                        highlights: [...draft.about.highlights, "New highlight"],
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Counters
                </p>
                <div className="space-y-3">
                  {draft.about.counters.map((c, i) => (
                    <Card
                      key={i}
                      title={`Counter ${i + 1}`}
                      onRemove={() =>
                        patch("about", {
                          ...draft.about,
                          counters: draft.about.counters.filter(
                            (_, j) => j !== i,
                          ),
                        })
                      }
                    >
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Field
                          label="Number"
                          type="number"
                          value={String(c.end)}
                          onChange={(v) =>
                            patch("about", {
                              ...draft.about,
                              counters: draft.about.counters.map((x, j) =>
                                j === i
                                  ? { ...x, end: Number(v) || 0 }
                                  : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Suffix"
                          value={c.suffix}
                          onChange={(v) =>
                            patch("about", {
                              ...draft.about,
                              counters: draft.about.counters.map((x, j) =>
                                j === i ? { ...x, suffix: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Label"
                          value={c.label}
                          onChange={(v) =>
                            patch("about", {
                              ...draft.about,
                              counters: draft.about.counters.map((x, j) =>
                                j === i ? { ...x, label: v } : x,
                              ),
                            })
                          }
                        />
                      </div>
                    </Card>
                  ))}
                  <AddButton
                    label="Add counter"
                    onClick={() =>
                      patch("about", {
                        ...draft.about,
                        counters: [
                          ...draft.about.counters,
                          { end: 0, suffix: "+", label: "New counter" },
                        ],
                      })
                    }
                  />
                </div>
              </div>
            </Section>
          )}

          {section === "services" && (
            <Section title="Services">
              <div className="space-y-3">
                {draft.services.map((svc, i) => (
                  <Card
                    key={i}
                    title={`Service ${i + 1}`}
                    onRemove={() =>
                      patch(
                        "services",
                        draft.services.filter((_, j) => j !== i),
                      )
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <SelectField
                        label="Icon"
                        value={svc.icon}
                        options={ICON_OPTIONS}
                        onChange={(v) =>
                          patch(
                            "services",
                            draft.services.map((s, j) =>
                              j === i
                                ? { ...s, icon: v as ServiceIcon }
                                : s,
                            ),
                          )
                        }
                      />
                      <Field
                        label="Title"
                        value={svc.title}
                        onChange={(v) =>
                          patch(
                            "services",
                            draft.services.map((s, j) =>
                              j === i ? { ...s, title: v } : s,
                            ),
                          )
                        }
                      />
                    </div>
                    <TextArea
                      label="Description"
                      value={svc.description}
                      onChange={(v) =>
                        patch(
                          "services",
                          draft.services.map((s, j) =>
                            j === i ? { ...s, description: v } : s,
                          ),
                        )
                      }
                    />
                  </Card>
                ))}
                <AddButton
                  label="Add service"
                  onClick={() =>
                    patch("services", [
                      ...draft.services,
                      {
                        icon: "home",
                        title: "New service",
                        description: "Describe this service.",
                      },
                    ])
                  }
                />
              </div>
            </Section>
          )}

          {section === "testimonials" && (
            <Section title="Testimonials">
              <div className="space-y-3">
                {draft.testimonials.map((t, i) => (
                  <Card
                    key={i}
                    title={`Testimonial ${i + 1}`}
                    onRemove={() =>
                      patch(
                        "testimonials",
                        draft.testimonials.filter((_, j) => j !== i),
                      )
                    }
                  >
                    <TextArea
                      label="Quote"
                      value={t.quote}
                      onChange={(v) =>
                        patch(
                          "testimonials",
                          draft.testimonials.map((x, j) =>
                            j === i ? { ...x, quote: v } : x,
                          ),
                        )
                      }
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field
                        label="Name"
                        value={t.name}
                        onChange={(v) =>
                          patch(
                            "testimonials",
                            draft.testimonials.map((x, j) =>
                              j === i ? { ...x, name: v } : x,
                            ),
                          )
                        }
                      />
                      <Field
                        label="Role"
                        value={t.role}
                        onChange={(v) =>
                          patch(
                            "testimonials",
                            draft.testimonials.map((x, j) =>
                              j === i ? { ...x, role: v } : x,
                            ),
                          )
                        }
                      />
                      <Field
                        label="Initials"
                        value={t.initials}
                        onChange={(v) =>
                          patch(
                            "testimonials",
                            draft.testimonials.map((x, j) =>
                              j === i ? { ...x, initials: v } : x,
                            ),
                          )
                        }
                      />
                    </div>
                  </Card>
                ))}
                <AddButton
                  label="Add testimonial"
                  onClick={() =>
                    patch("testimonials", [
                      ...draft.testimonials,
                      {
                        quote: "Their work exceeded our expectations.",
                        name: "Client name",
                        role: "Role / Company",
                        initials: "CN",
                      },
                    ])
                  }
                />
              </div>
            </Section>
          )}

          {section === "projects" && (
            <Section title="Projects">
              <p className="-mt-2 mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
                Cover image is a path under <code>/public</code> (e.g.
                <code> /gallery/interior/interior-1.jpg</code>). Adding brand-new
                photos still goes through the normal image-upload flow with your
                developer; here you can edit text, choose a gallery, and pick the
                cover.
              </p>
              <div className="space-y-3">
                {draft.projects.map((p, i) => (
                  <Card
                    key={i}
                    title={`Project ${i + 1}`}
                    onRemove={() =>
                      patch(
                        "projects",
                        draft.projects.filter((_, j) => j !== i),
                      )
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Category"
                        value={p.category}
                        onChange={(v) =>
                          patch(
                            "projects",
                            draft.projects.map((x, j) =>
                              j === i ? { ...x, category: v } : x,
                            ),
                          )
                        }
                      />
                      <SelectField
                        label="Gallery"
                        value={p.gallery}
                        options={GALLERY_OPTIONS}
                        onChange={(v) =>
                          patch(
                            "projects",
                            draft.projects.map((x, j) =>
                              j === i
                                ? { ...x, gallery: v as ProjectGallery }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <Field
                      label="Cover image path"
                      value={p.image}
                      onChange={(v) =>
                        patch(
                          "projects",
                          draft.projects.map((x, j) =>
                            j === i ? { ...x, image: v } : x,
                          ),
                        )
                      }
                    />
                    <TextArea
                      label="Description"
                      value={p.description}
                      onChange={(v) =>
                        patch(
                          "projects",
                          draft.projects.map((x, j) =>
                            j === i ? { ...x, description: v } : x,
                          ),
                        )
                      }
                    />
                  </Card>
                ))}
                <AddButton
                  label="Add project"
                  onClick={() =>
                    patch("projects", [
                      ...draft.projects,
                      {
                        category: "New",
                        description: "Describe this project.",
                        image: "/projects/commercial-tower.svg",
                        gallery: "none",
                      },
                    ])
                  }
                />
              </div>
            </Section>
          )}

          {section === "faqs" && (
            <Section title="FAQs (chat assistant)">
              <div className="space-y-3">
                {draft.faqs.map((f, i) => (
                  <Card
                    key={i}
                    title={`FAQ ${i + 1}`}
                    onRemove={() =>
                      patch(
                        "faqs",
                        draft.faqs.filter((_, j) => j !== i),
                      )
                    }
                  >
                    <Field
                      label="Question"
                      value={f.label}
                      onChange={(v) =>
                        patch(
                          "faqs",
                          draft.faqs.map((x, j) =>
                            j === i ? { ...x, label: v } : x,
                          ),
                        )
                      }
                    />
                    <TextArea
                      label="Answer"
                      value={f.answer}
                      onChange={(v) =>
                        patch(
                          "faqs",
                          draft.faqs.map((x, j) =>
                            j === i ? { ...x, answer: v } : x,
                          ),
                        )
                      }
                    />
                  </Card>
                ))}
                <AddButton
                  label="Add FAQ"
                  onClick={() =>
                    patch("faqs", [
                      ...draft.faqs,
                      { label: "New question?", answer: "Answer here." },
                    ])
                  }
                />
              </div>
            </Section>
          )}

          {section === "customerProjects" && <AdminPanelProjects />}

          {section === "customerDocuments" && <AdminPanelDocuments />}

          {section === "leads" && <AdminPanelLeads />}

          {section === "messages" && <AdminPanelMessages />}
        </main>
      </div>

      {/* Import modal */}
      {importing && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/60 p-4"
          onClick={() => setImporting(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-lg font-bold">Import content JSON</h3>
            <p className="mt-1 text-sm text-slate-500">
              Paste a previously exported <code>kazi-site-content.json</code>.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={10}
              placeholder="{ ... }"
              className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImporting(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-extrabold text-slate-900">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
