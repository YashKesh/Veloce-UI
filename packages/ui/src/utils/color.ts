/**
 * Zero-dependency color utilities.
 * Internal representation is sRGB in [0,1] + alpha in [0,1].
 * All conversions go through this canonical form.
 */

export interface Rgb {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
  a: number // 0-1
}

export interface Hsl {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
  a: number // 0-1
}

export interface Oklch {
  l: number // 0-1
  c: number // 0-~0.4
  h: number // 0-360
  a: number // 0-1
}

export interface ColorValue {
  hex: string
  rgb: Rgb
  hsl: Hsl
  oklch: Oklch
  alpha: number
}

const clamp = (x: number, min = 0, max = 1) => Math.min(max, Math.max(min, x))
const round = (x: number, p = 0) => {
  const k = 10 ** p
  return Math.round(x * k) / k
}

/* ─── HEX ─────────────────────────────────────────────────────── */

export function parseHex(input: string): Rgb | null {
  let h = input.trim().replace(/^#/, '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length === 4) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return { r, g, b, a }
}

export function rgbToHex({ r, g, b, a }: Rgb, forceAlpha = false): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  const base = `#${to(r)}${to(g)}${to(b)}`
  if (!forceAlpha && a >= 1) return base
  return `${base}${to(a * 255)}`
}

/* ─── RGB string ──────────────────────────────────────────────── */

export function parseRgbString(input: string): Rgb | null {
  const m = input.trim().match(
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
  )
  if (!m) return null
  const r = Number(m[1])
  const g = Number(m[2])
  const b = Number(m[3])
  let a = 1
  if (m[4] != null) {
    a = m[4].endsWith('%') ? Number(m[4].slice(0, -1)) / 100 : Number(m[4])
  }
  if ([r, g, b, a].some((n) => Number.isNaN(n))) return null
  return { r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255), a: clamp(a) }
}

export function formatRgb({ r, g, b, a }: Rgb): string {
  const R = round(r)
  const G = round(g)
  const B = round(b)
  if (a >= 1) return `rgb(${R}, ${G}, ${B})`
  return `rgba(${R}, ${G}, ${B}, ${round(a, 3)})`
}

/* ─── HSL ─────────────────────────────────────────────────────── */

export function rgbToHsl({ r, g, b, a }: Rgb): Hsl {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case R: h = (G - B) / d + (G < B ? 6 : 0); break
      case G: h = (B - R) / d + 2; break
      case B: h = (R - G) / d + 4; break
    }
    h *= 60
  }
  return { h: round(h, 2), s: round(s * 100, 2), l: round(l * 100, 2), a }
}

export function hslToRgb({ h, s, l, a }: Hsl): Rgb {
  const S = s / 100
  const L = l / 100
  const C = (1 - Math.abs(2 * L - 1)) * S
  const Hp = ((h % 360) + 360) % 360 / 60
  const X = C * (1 - Math.abs((Hp % 2) - 1))
  let r1 = 0, g1 = 0, b1 = 0
  if (Hp < 1) { r1 = C; g1 = X }
  else if (Hp < 2) { r1 = X; g1 = C }
  else if (Hp < 3) { g1 = C; b1 = X }
  else if (Hp < 4) { g1 = X; b1 = C }
  else if (Hp < 5) { r1 = X; b1 = C }
  else { r1 = C; b1 = X }
  const m = L - C / 2
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a,
  }
}

export function parseHslString(input: string): Hsl | null {
  const m = input.trim().match(
    /^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
  )
  if (!m) return null
  const h = Number(m[1])
  const s = Number(m[2])
  const l = Number(m[3])
  let a = 1
  if (m[4] != null) {
    a = m[4].endsWith('%') ? Number(m[4].slice(0, -1)) / 100 : Number(m[4])
  }
  if ([h, s, l, a].some((n) => Number.isNaN(n))) return null
  return { h, s, l, a: clamp(a) }
}

export function formatHsl({ h, s, l, a }: Hsl): string {
  const H = round(h, 1)
  const S = round(s, 1)
  const L = round(l, 1)
  if (a >= 1) return `hsl(${H}, ${S}%, ${L}%)`
  return `hsla(${H}, ${S}%, ${L}%, ${round(a, 3)})`
}

/* ─── OKLCH (via OKLab, Ottosson matrices) ────────────────────── */

const srgbToLinear = (c: number) => {
  const x = c / 255
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
}
const linearToSrgb = (x: number) => {
  const c = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  return clamp(c, 0, 1) * 255
}

export function rgbToOklch({ r, g, b, a }: Rgb): Oklch {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const C = Math.sqrt(A * A + B * B)
  let h = (Math.atan2(B, A) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: round(L, 4), c: round(C, 4), h: round(h, 2), a }
}

export function oklchToRgb({ l, c, h, a }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180
  const A = Math.cos(hr) * c
  const B = Math.sin(hr) * c

  const l_ = l + 0.3963377774 * A + 0.2158037573 * B
  const m_ = l - 0.1055613458 * A - 0.0638541728 * B
  const s_ = l - 0.0894841775 * A - 1.291485548 * B

  const lr = l_ ** 3
  const lg = m_ ** 3
  const lb = s_ ** 3

  const R = +4.0767416621 * lr - 3.3077115913 * lg + 0.2309699292 * lb
  const G = -1.2684380046 * lr + 2.6097574011 * lg - 0.3413193965 * lb
  const Bl = -0.0041960863 * lr - 0.7034186147 * lg + 1.707614701 * lb

  return {
    r: Math.round(linearToSrgb(R)),
    g: Math.round(linearToSrgb(G)),
    b: Math.round(linearToSrgb(Bl)),
    a,
  }
}

export function parseOklchString(input: string): Oklch | null {
  const m = input.trim().match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
  )
  if (!m) return null
  const lRaw = m[1]
  const cRaw = m[2]
  const hRaw = m[3]
  const aRaw = m[4]
  const l = lRaw.endsWith('%') ? Number(lRaw.slice(0, -1)) / 100 : Number(lRaw)
  const c = cRaw.endsWith('%') ? (Number(cRaw.slice(0, -1)) / 100) * 0.4 : Number(cRaw)
  const h = Number(hRaw)
  let a = 1
  if (aRaw != null) {
    a = aRaw.endsWith('%') ? Number(aRaw.slice(0, -1)) / 100 : Number(aRaw)
  }
  if ([l, c, h, a].some((n) => Number.isNaN(n))) return null
  return { l, c, h, a: clamp(a) }
}

export function formatOklch({ l, c, h, a }: Oklch): string {
  const L = round(l, 4)
  const C = round(c, 4)
  const H = round(h, 2)
  if (a >= 1) return `oklch(${L} ${C} ${H})`
  return `oklch(${L} ${C} ${H} / ${round(a, 3)})`
}

/* ─── Universal parser ────────────────────────────────────────── */

export function parseColor(input: string): ColorValue | null {
  if (!input) return null
  const trimmed = input.trim()
  let rgb: Rgb | null = null
  if (trimmed.startsWith('#')) rgb = parseHex(trimmed)
  else if (/^rgba?\(/i.test(trimmed)) rgb = parseRgbString(trimmed)
  else if (/^hsla?\(/i.test(trimmed)) {
    const hsl = parseHslString(trimmed)
    if (hsl) rgb = hslToRgb(hsl)
  } else if (/^oklch\(/i.test(trimmed)) {
    const o = parseOklchString(trimmed)
    if (o) rgb = oklchToRgb(o)
  } else {
    rgb = parseHex(trimmed) // bare hex without #
  }
  if (!rgb) return null
  return fromRgb(rgb)
}

export function fromRgb(rgb: Rgb): ColorValue {
  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: rgbToHsl(rgb),
    oklch: rgbToOklch(rgb),
    alpha: rgb.a,
  }
}

/* ─── Contrast (WCAG 2.1) ─────────────────────────────────────── */

function relativeLuminance({ r, g, b }: Rgb): number {
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getContrastRatio(a: string | Rgb, b: string | Rgb): number {
  const rgbA = typeof a === 'string' ? parseColor(a)?.rgb : a
  const rgbB = typeof b === 'string' ? parseColor(b)?.rgb : b
  if (!rgbA || !rgbB) return 1
  const la = relativeLuminance(rgbA)
  const lb = relativeLuminance(rgbB)
  const [bright, dark] = la > lb ? [la, lb] : [lb, la]
  return (bright + 0.05) / (dark + 0.05)
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

export function wcagLevel(ratio: number, size: 'normal' | 'large' = 'normal'): WcagLevel {
  if (size === 'large') {
    if (ratio >= 4.5) return 'AAA'
    if (ratio >= 3) return 'AA'
    return 'Fail'
  }
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}
