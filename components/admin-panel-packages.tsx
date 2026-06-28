"use client"

import type {
  PackagesContent,
  PackageCategory,
  PackageRow,
  PackageHomeType,
  PackageCellValue,
} from "@/lib/site-content"

/* ------------------------------ primitives ------------------------------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </span>
  )
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  )
}

function RemoveBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
    >
      {label}
    </button>
  )
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
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

function Block({
  title,
  children,
  onRemove,
}: {
  title: string
  children: React.ReactNode
  onRemove?: () => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {onRemove && <RemoveBtn onClick={onRemove} label="Remove" />}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/* ------------------------------- cell editor ----------------------------- */

function cellKind(v: PackageCellValue): "yes" | "no" | "text" {
  if (v === true) return "yes"
  if (v === false) return "no"
  return "text"
}

function CellEditor({
  value,
  onChange,
}: {
  value: PackageCellValue
  onChange: (v: PackageCellValue) => void
}) {
  const kind = cellKind(value)
  return (
    <div className="space-y-1.5">
      <select
        value={kind}
        onChange={(e) => {
          const k = e.target.value
          if (k === "yes") onChange(true)
          else if (k === "no") onChange(false)
          else onChange(typeof value === "string" ? value : "")
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-900"
      >
        <option value="yes">Included ✓</option>
        <option value="no">Not included ✗</option>
        <option value="text">Custom text</option>
      </select>
      {kind === "text" && (
        <input
          value={typeof value === "string" ? value : ""}
          placeholder="e.g. Premium grade"
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-900"
        />
      )}
    </div>
  )
}

/* -------------------------------- editor --------------------------------- */

export function AdminPanelPackages({
  value,
  onChange,
}: {
  value: PackagesContent
  onChange: (next: PackagesContent) => void
}) {
  const { cities, tiers, homeTypes, categories } = value

  function update(patch: Partial<PackagesContent>) {
    onChange({ ...value, ...patch })
  }

  /* cities */
  function setCity(i: number, v: string) {
    update({ cities: cities.map((c, j) => (j === i ? v : c)) })
  }
  function addCity() {
    update({ cities: [...cities, "New City"] })
  }
  function removeCity(i: number) {
    update({ cities: cities.filter((_, j) => j !== i) })
  }

  /* tiers — keep perSqft and every row's values aligned by index */
  function renameTier(i: number, v: string) {
    update({ tiers: tiers.map((t, j) => (j === i ? v : t)) })
  }
  function addTier() {
    update({
      tiers: [...tiers, `Tier ${tiers.length + 1}`],
      homeTypes: homeTypes.map((ht) => ({ ...ht, perSqft: [...ht.perSqft, ""] })),
      categories: categories.map((cat) => ({
        ...cat,
        rows: cat.rows.map((r) => ({ ...r, values: [...r.values, true] })),
      })),
    })
  }
  function removeTier(i: number) {
    if (tiers.length <= 1) return
    update({
      tiers: tiers.filter((_, j) => j !== i),
      homeTypes: homeTypes.map((ht) => ({
        ...ht,
        perSqft: ht.perSqft.filter((_, j) => j !== i),
      })),
      categories: categories.map((cat) => ({
        ...cat,
        rows: cat.rows.map((r) => ({
          ...r,
          values: r.values.filter((_, j) => j !== i),
        })),
      })),
    })
  }

  /* home types */
  function patchHomeType(i: number, patch: Partial<PackageHomeType>) {
    update({
      homeTypes: homeTypes.map((ht, j) => (j === i ? { ...ht, ...patch } : ht)),
    })
  }
  function setPerSqft(i: number, tierIdx: number, v: string) {
    update({
      homeTypes: homeTypes.map((ht, j) =>
        j === i
          ? { ...ht, perSqft: ht.perSqft.map((p, k) => (k === tierIdx ? v : p)) }
          : ht,
      ),
    })
  }
  function addHomeType() {
    update({
      homeTypes: [
        ...homeTypes,
        { name: "New Type", startsAt: "", perSqft: tiers.map(() => "") },
      ],
    })
  }
  function removeHomeType(i: number) {
    update({ homeTypes: homeTypes.filter((_, j) => j !== i) })
  }

  /* categories + rows */
  function patchCategory(i: number, patch: Partial<PackageCategory>) {
    update({
      categories: categories.map((c, j) => (j === i ? { ...c, ...patch } : c)),
    })
  }
  function addCategory() {
    update({
      categories: [
        ...categories,
        { name: "New Category", note: "", rows: [] },
      ],
    })
  }
  function removeCategory(i: number) {
    update({ categories: categories.filter((_, j) => j !== i) })
  }
  function patchRow(catIdx: number, rowIdx: number, patch: Partial<PackageRow>) {
    update({
      categories: categories.map((c, j) =>
        j === catIdx
          ? {
              ...c,
              rows: c.rows.map((r, k) => (k === rowIdx ? { ...r, ...patch } : r)),
            }
          : c,
      ),
    })
  }
  function addRow(catIdx: number) {
    update({
      categories: categories.map((c, j) =>
        j === catIdx
          ? {
              ...c,
              rows: [
                ...c.rows,
                { label: "New item", spec: "", values: tiers.map(() => true) },
              ],
            }
          : c,
      ),
    })
  }
  function removeRow(catIdx: number, rowIdx: number) {
    update({
      categories: categories.map((c, j) =>
        j === catIdx
          ? { ...c, rows: c.rows.filter((_, k) => k !== rowIdx) }
          : c,
      ),
    })
  }
  function setCellValue(
    catIdx: number,
    rowIdx: number,
    tierIdx: number,
    v: PackageCellValue,
  ) {
    const row = categories[catIdx].rows[rowIdx]
    patchRow(catIdx, rowIdx, {
      values: row.values.map((x, k) => (k === tierIdx ? v : x)),
    })
  }

  return (
    <section className="space-y-8">
      <h2 className="font-heading text-xl font-extrabold text-slate-900">
        Packages
      </h2>
      <p className="-mt-5 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
        Edit your build packages here. Changes preview instantly on the site in
        this browser. To publish for everyone, press <strong>Download</strong>{" "}
        (or <strong>Copy JSON</strong>) in the top bar and send the file to your
        developer to commit.
      </p>

      {/* Cities */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Cities
        </p>
        <div className="space-y-2">
          {cities.map((c, i) => (
            <div key={i} className="flex gap-2">
              <TextInput value={c} onChange={(v) => setCity(i, v)} />
              <RemoveBtn onClick={() => removeCity(i)} label="Remove" />
            </div>
          ))}
          <AddBtn label="Add city" onClick={addCity} />
        </div>
      </div>

      {/* Tiers */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Package tiers
        </p>
        <div className="space-y-2">
          {tiers.map((t, i) => (
            <div key={i} className="flex gap-2">
              <TextInput value={t} onChange={(v) => renameTier(i, v)} />
              <RemoveBtn onClick={() => removeTier(i)} label="Remove" />
            </div>
          ))}
          <AddBtn label="Add tier" onClick={addTier} />
        </div>
      </div>

      {/* Home types + pricing */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Home types & price per sqft
        </p>
        <div className="space-y-3">
          {homeTypes.map((ht, i) => (
            <Block
              key={i}
              title={ht.name || `Type ${i + 1}`}
              onRemove={() => removeHomeType(i)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <Label>Type name</Label>
                  <TextInput
                    value={ht.name}
                    onChange={(v) => patchHomeType(i, { name: v })}
                  />
                </label>
                <label className="block">
                  <Label>Starts at</Label>
                  <TextInput
                    value={ht.startsAt}
                    onChange={(v) => patchHomeType(i, { startsAt: v })}
                    placeholder="₹2030"
                  />
                </label>
              </div>
              <div>
                <Label>Price per sqft (by tier)</Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {tiers.map((tier, k) => (
                    <label key={k} className="block">
                      <span className="mb-1 block text-[11px] font-medium text-slate-500">
                        {tier}
                      </span>
                      <TextInput
                        value={ht.perSqft[k] ?? ""}
                        onChange={(v) => setPerSqft(i, k, v)}
                        placeholder="₹0000"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </Block>
          ))}
          <AddBtn label="Add home type" onClick={addHomeType} />
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Categories
        </p>
        <div className="space-y-4">
          {categories.map((cat, ci) => (
            <Block
              key={ci}
              title={cat.name || `Category ${ci + 1}`}
              onRemove={() => removeCategory(ci)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <Label>Category name</Label>
                  <TextInput
                    value={cat.name}
                    onChange={(v) => patchCategory(ci, { name: v })}
                  />
                </label>
                <label className="block">
                  <Label>Note (optional)</Label>
                  <TextInput
                    value={cat.note ?? ""}
                    onChange={(v) => patchCategory(ci, { note: v })}
                    placeholder="*All fittings can be customised at cost"
                  />
                </label>
              </div>

              <div className="space-y-3">
                {cat.rows.map((row, ri) => (
                  <div
                    key={ri}
                    className="rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Row {ri + 1}
                      </span>
                      <RemoveBtn
                        onClick={() => removeRow(ci, ri)}
                        label="Remove row"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="block">
                        <Label>Item</Label>
                        <TextInput
                          value={row.label}
                          onChange={(v) => patchRow(ci, ri, { label: v })}
                        />
                      </label>
                      <label className="block">
                        <Label>Spec (optional)</Label>
                        <TextInput
                          value={row.spec ?? ""}
                          onChange={(v) => patchRow(ci, ri, { spec: v })}
                          placeholder="e.g. Fe 550 / Fe 550D"
                        />
                      </label>
                    </div>
                    <div className="mt-3">
                      <Label>Value per tier</Label>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {tiers.map((tier, k) => (
                          <div key={k}>
                            <span className="mb-1 block text-[11px] font-medium text-slate-500">
                              {tier}
                            </span>
                            <CellEditor
                              value={row.values[k] ?? false}
                              onChange={(v) => setCellValue(ci, ri, k, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <AddBtn label="Add row" onClick={() => addRow(ci)} />
              </div>
            </Block>
          ))}
          <AddBtn label="Add category" onClick={addCategory} />
        </div>
      </div>
    </section>
  )
}
