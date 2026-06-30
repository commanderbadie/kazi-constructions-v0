"use client"

import { useState } from "react"
import {
  Check,
  X,
  ChevronDown,
  Hammer,
  Layers,
  Droplets,
  Zap,
  Paintbrush,
  DoorOpen,
  AppWindow,
  Ruler,
  Flame,
  Container,
  Fence,
  Plug,
  Grid3x3,
  Blocks,
  SquareStack,
  ShowerHead,
  Wrench,
  CookingPot,
  Bath,
  Cable,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"
import { useSiteContent } from "@/lib/use-site-content"
import type { PackageCellValue, PackageCategory } from "@/lib/site-content"

// Strip a trailing "( ... )" qualifier from tier name for a clean title.
function cleanTier(name: string) {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim()
}

// Split a price string like "₹1799 ( Excl GST )" into the price and qualifier.
function splitPrice(price: string): { amount: string; qualifier: string } {
  const match = price.match(/^(.+?)\s*(\([^)]*\))$/)
  if (match) return { amount: match[1].trim(), qualifier: match[2].trim() }
  return { amount: price, qualifier: "" }
}

// Icon mapping for category headers
const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/structure/i, Layers],
  [/kitchen/i, CookingPot],
  [/bathroom/i, Bath],
  [/door|window/i, DoorOpen],
  [/paint/i, Paintbrush],
  [/floor/i, Grid3x3],
  [/wir|electric/i, Cable],
  [/other/i, MoreHorizontal],
]

function iconForCategory(name: string): LucideIcon {
  for (const [re, Icon] of CATEGORY_ICONS) {
    if (re.test(name)) return Icon
  }
  return Hammer
}

function rowDiffers(values: PackageCellValue[]) {
  return new Set(values.map((v) => String(v))).size > 1
}

// Pick a small, relevant icon for a row based on its label. Keyword order
// matters — more specific terms are checked first; falls back to a hammer.
const ICON_RULES: [RegExp, LucideIcon][] = [
  [/railing/i, Fence],
  [/grill/i, Fence],
  [/door/i, DoorOpen],
  [/window/i, AppWindow],
  [/paint/i, Paintbrush],
  [/sanitary/i, ShowerHead],
  [/sink|faucet|tap/i, Droplets],
  [/cpvc|pipe|plumb/i, Droplets],
  [/solar|heater|gas/i, Flame],
  [/switch|socket/i, Plug],
  [/ev|charging|ups|wir|electric/i, Zap],
  [/ceramic|dado|tile|floor|balcony|parking/i, Grid3x3],
  [/tank|sump|overhead/i, Container],
  [/steel/i, Wrench],
  [/cement/i, Container],
  [/aggregate/i, Blocks],
  [/block|brick/i, SquareStack],
  [/rcc|concrete|mix/i, Layers],
  [/ceiling|height/i, Ruler],
  [/stair/i, Layers],
]

function iconForRow(label: string): LucideIcon {
  for (const [re, Icon] of ICON_RULES) {
    if (re.test(label)) return Icon
  }
  return Hammer
}

function Cell({ value }: { value: PackageCellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex" aria-label="Included">
        <Check className="h-5 w-5 text-emerald-600" />
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex" aria-label="Not included">
        <X className="h-5 w-5 text-rose-400" />
      </span>
    )
  }
  return <span className="text-sm text-foreground">{value}</span>
}

export function PackagesTable() {
  const { packages } = useSiteContent()
  const { tiers, homeTypes, cities, categories } = packages

  const [homeTypeIdx, setHomeTypeIdx] = useState(0)
  const [city, setCity] = useState(cities[0] ?? "")
  const [highlight, setHighlight] = useState(true)
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.name, false])),
  )

  function toggleCat(name: string) {
    setOpenCats((prev) => ({ ...prev, [name]: !(prev[name] ?? false) }))
  }

  const activeType = homeTypes[homeTypeIdx] ?? homeTypes[0]

  return (
    <div>
      {/* Controls: city + home type */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        {cities.length > 0 && (
          <label className="flex items-center gap-2">
            <span className="sr-only">Select city</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}

        {homeTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-sm font-bold text-foreground">Type:</span>
            {homeTypes.map((type, i) => {
              const active = i === homeTypeIdx
              return (
                <button
                  key={type.name + i}
                  type="button"
                  onClick={() => setHomeTypeIdx(i)}
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
                      {type.name}
                    </span>{" "}
                    {type.startsAt && (
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        starts at {type.startsAt} per sqft
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Comparison table */}
      <div className="mt-7 overflow-x-auto rounded-2xl border border-border lg:overflow-x-visible">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="sticky top-20 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <tr className="border-b border-border">
              <th className="w-[26%] p-4 align-middle bg-muted">
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
              {tiers.map((tier, i) => (
                <th key={tier + i} className="p-4 align-top bg-muted">
                  <div className="font-heading text-lg font-extrabold text-foreground">
                    {cleanTier(tier)}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-primary">
                    {(() => {
                      const { amount, qualifier } = splitPrice(activeType?.perSqft[i] ?? "")
                      return (
                        <>
                          {amount}
                          {qualifier && (
                            <span className="text-xs font-normal text-primary/70"> {qualifier}</span>
                          )}
                          {" "}per sqft
                        </>
                      )
                    })()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <CategoryRows
                key={category.name}
                category={category}
                tierCount={tiers.length}
                highlight={highlight}
                open={openCats[category.name] ?? false}
                onToggle={() => toggleCat(category.name)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {city ? `Specifications shown for ${city}. ` : ""}Final materials and
        pricing are confirmed during your consultation.
      </p>
    </div>
  )
}

function CategoryRows({
  category,
  tierCount,
  highlight,
  open,
  onToggle,
}: {
  category: PackageCategory
  tierCount: number
  highlight: boolean
  open: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr>
        <td colSpan={tierCount + 1} className="border-b border-border bg-accent/[0.04] p-0">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/[0.07]"
          >
            <span className="flex items-center gap-2.5 font-heading text-sm font-extrabold uppercase tracking-wider text-foreground">
              {(() => {
                const CatIcon = iconForCategory(category.name)
                return <CatIcon className="h-4 w-4 text-gold" aria-hidden="true" />
              })()}
              {category.name}
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </td>
      </tr>

      {open &&
        category.rows.map((row) => {
          const differs = highlight && rowDiffers(row.values)
          const Icon = iconForRow(row.label)
          return (
            <tr
              key={row.label}
              className="border-b border-border/70 last:border-b-0"
            >
              <td className="p-4 align-top">
                <div className="flex items-start gap-2.5">
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {row.label}
                    </div>
                    {row.spec && (
                      <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {row.spec}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              {Array.from({ length: tierCount }).map((_, i) => (
                <td
                  key={i}
                  className={`p-4 align-middle ${differs ? "bg-gold/[0.07]" : ""}`}
                >
                  <Cell value={row.values[i] ?? false} />
                </td>
              ))}
            </tr>
          )
        })}

      {open && category.note && (
        <tr>
          <td
            colSpan={tierCount + 1}
            className="px-4 py-3 text-xs italic text-muted-foreground"
          >
            {category.note}
          </td>
        </tr>
      )}
    </>
  )
}
