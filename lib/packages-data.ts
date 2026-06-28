// Package comparison data for the /packages page.
//
// Everything the table renders comes from here, so adding new categories or
// rows later is just a matter of extending CATEGORIES — no UI changes needed.
// Values are sample specifications: replace with Kazi's real offerings.

export type PackageTier = "Basic" | "Classic" | "Premium" | "Royale"

export const TIERS: PackageTier[] = ["Basic", "Classic", "Premium", "Royale"]

export type HomeType = "Homes" | "Luxury Homes"

export const HOME_TYPES: HomeType[] = ["Homes", "Luxury Homes"]

export const CITIES = ["Hyderabad", "Bengaluru", "Chennai", "Pune"] as const

/** Per-sqft pricing per home type. "startsAt" drives the header sub-label. */
export const PRICING: Record<
  HomeType,
  { startsAt: string; perSqft: Record<PackageTier, string> }
> = {
  Homes: {
    startsAt: "₹2030",
    perSqft: {
      Basic: "₹2030",
      Classic: "₹2200",
      Premium: "₹2600",
      Royale: "₹2830",
    },
  },
  "Luxury Homes": {
    startsAt: "₹4280",
    perSqft: {
      Basic: "₹4280",
      Classic: "₹4600",
      Premium: "₹5200",
      Royale: "₹5800",
    },
  },
}

/** A cell value: `true` renders a check, a string renders text. */
export type CellValue = string | boolean

export type SpecRow = {
  label: string
  /** Optional spec / sub-label shown under the row label. */
  spec?: string
  values: Record<PackageTier, CellValue>
}

export type Category = {
  name: string
  rows: SpecRow[]
  /** Optional footnote shown under the category. */
  note?: string
}

export const CATEGORIES: Category[] = [
  {
    name: "Structure",
    note: "*RCC design mix as advised by the structural engineer.",
    rows: [
      {
        label: "Steel",
        spec: "Fe 550 / Fe 550D",
        values: {
          Basic: "ISI-certified",
          Classic: "ISI-certified",
          Premium: "Primary-producer grade",
          Royale: "Primary-producer grade",
        },
      },
      {
        label: "Cement",
        spec: "43 grade in surface, 53 grade in core",
        values: {
          Basic: "Standard grade",
          Classic: "Standard grade",
          Premium: "Premium grade",
          Royale: "Premium grade",
        },
      },
      {
        label: "Aggregates",
        spec: "20mm & 40mm",
        values: { Basic: true, Classic: true, Premium: true, Royale: true },
      },
      {
        label: "Block work",
        spec: '9" (outer), 4.5" (inner) – Standard Red Brick',
        values: { Basic: true, Classic: true, Premium: true, Royale: true },
      },
      {
        label: "RCC Mix",
        spec: "M20 or M25",
        values: {
          Basic: true,
          Classic: true,
          Premium: "Premium grade",
          Royale: "Premium grade",
        },
      },
      {
        label: "Ceiling height",
        spec: "Floor-to-floor height 10ft",
        values: { Basic: true, Classic: true, Premium: true, Royale: true },
      },
    ],
  },
]
