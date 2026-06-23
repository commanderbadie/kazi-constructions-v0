import sharp from "sharp"
import { readFile, writeFile } from "node:fs/promises"

const SRC = "public/kazi-logo.png"
const OUT = "public/kazi-logo-transparent.png"

// Background is a flat light grey ~#f7f7f7. Key out anything close to it.
// Use a moderate threshold; building interiors share this color and will
// also become transparent (they read as outlined buildings), which is fine.
const TARGET = [247, 247, 247]
const THRESHOLD = 18 // per-channel distance

const img = sharp(SRC).ensureAlpha()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

for (let i = 0; i < data.length; i += channels) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (
    Math.abs(r - TARGET[0]) <= THRESHOLD &&
    Math.abs(g - TARGET[1]) <= THRESHOLD &&
    Math.abs(b - TARGET[2]) <= THRESHOLD
  ) {
    data[i + 3] = 0 // fully transparent
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .trim() // remove fully transparent border padding
  .toFile(OUT)

console.log("[v0] wrote", OUT)
