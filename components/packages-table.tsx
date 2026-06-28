"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import {
  CATEGORIES,
  CITIES,
  HOME_TYPES,
  PRICING,
  TIERS,
  type CellValue,
  type HomeType,
} from "@/lib/packages-data"

function rowDiffers(values: Record<string, CellValue>) {
  const seen = new Set(Object.values(values).map((v) => String(v)))
  return seen.size > 1
}

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex" aria-label="Included">
        <Check className="h-5 w-5 text-emerald-600" />
      </span>
    )
  }
  if (value === false) {
    return <span className="text-muted-foreground/50">—</span>
  }
  return <span className="text-sm text-foreground">{value}</span>
}

export function PackagesTable() {
  const [homeType, setHomeType] = useState<HomeType>("Homes")
  const [city, setCity] = useState<string>(CITIES[0])
  const [highlight, setHighlight] = useState(true)

  const pricing = PRICING[homeType]

  return (
    <div>
      {/* Controls: city + home type */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <label className="flex items-center gap-2">
          <span className="sr-only">Select city</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-sm font-bold text-foreground">Type:</span>
          {HOME_TYPES.map((type) => {
            const active = homeType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setHomeType(type)}
                className="flex items-center gap-2 text-left"
                aria-pressed={active}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                    active ? "border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>
                <span className="text-sm">
                  <span
                    className={
                      active
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground"
                    }
                  >
                    {type}
                  </span>{" "}
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    starts at {PRICING[type].startsAt} per sqft
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-7 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-[26%] p-4 align-middle">
                <label className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={highlight}
                    onClick={() => setHighlight((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      highlight ? "bg-emerald-500" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        highlight ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    Highlight differences
                  </span>
                </label>
              </th>
              {TIERS.map((tier) => (
                <th key={tier} className="p-4 align-top">
                  <div className="font-heading text-lg font-extrabold text-foreground">
                    {tier}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-primary">
                    {pricing.perSqft[tier]} per sqft
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {CATEGORIES.map((category) => (
              <CategoryRows
                key={category.name}
                category={category}
                highlight={highlight}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Sample specifications shown for {city}. Final materials and pricing are
        confirmed during your consultation.
      </p>
    </div>
  )
}

function CategoryRows({
  category,
  highlight,
}: {
  category: { name: string; rows: typeof CATEGORIES[number]["rows"]; note?: string }
  highlight: boolean
}) {
  return (
    <>
      <tr>
        <td
          colSpan={TIERS.length + 1}
          className="border-b border-border bg-accent/[0.04] px-4 py-3 font-heading text-sm font-extrabold uppercase tracking-wider text-foreground"
        >
          {category.name}
        </td>
      </tr>

      {category.rows.map((row) => {
        const differs = highlight && rowDiffers(row.values)
        return (
          <tr
            key={row.label}
            className="border-b border-border/70 last:border-b-0"
          >
            <td className="p-4 align-top">
              <div className="font-semibold text-foreground">{row.label}</div>
              {row.spec && (
                <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {row.spec}
                </div>
              )}
            </td>
            {TIERS.map((tier) => (
              <td
                key={tier}
                className={`p-4 align-middle ${
                  differs ? "bg-gold/[0.07]" : ""
                }`}
              >
                <Cell value={row.values[tier]} />
              </td>
            ))}
          </tr>
        )
      })}

      {category.note && (
        <tr>
          <td
            colSpan={TIERS.length + 1}
            className="px-4 py-3 text-xs italic text-muted-foreground"
          >
            {category.note}
          </td>
        </tr>
      )}
    </>
  )
}
