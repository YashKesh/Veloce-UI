import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = join(here, '..', 'public')
const svgPath = join(publicDir, 'og.svg')
const pngPath = join(publicDir, 'og.png')

if (!existsSync(svgPath)) {
  console.warn('[generate-og] public/og.svg not found — skipping PNG render')
  process.exit(0)
}

const svg = readFileSync(svgPath, 'utf8')
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
writeFileSync(pngPath, png)
console.log(`[generate-og] wrote ${pngPath} (${(png.byteLength / 1024).toFixed(1)} KB)`)
