import { describe, it, expect } from 'vitest'
import {
  parseColor,
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  getContrastRatio,
  wcagLevel,
} from '../../utils/color'

describe('parseHex', () => {
  it('parses 3-digit hex', () => {
    expect(parseHex('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })
  it('parses 6-digit hex', () => {
    expect(parseHex('#3b82f6')).toEqual({ r: 59, g: 130, b: 246, a: 1 })
  })
  it('parses 8-digit hex with alpha', () => {
    const rgb = parseHex('#3b82f680')
    expect(rgb?.r).toBe(59)
    expect(rgb?.a).toBeCloseTo(128 / 255, 3)
  })
  it('rejects invalid hex', () => {
    expect(parseHex('nope')).toBeNull()
    expect(parseHex('#12345')).toBeNull()
  })
})

describe('rgbToHex / round-trip', () => {
  it('round-trips opaque', () => {
    const hex = '#3b82f6'
    expect(rgbToHex(parseHex(hex)!)).toBe(hex)
  })
  it('emits alpha channel only when < 1', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000')
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 0.5 })).toMatch(/^#000000[0-9a-f]{2}$/)
  })
})

describe('HSL round-trip', () => {
  it('round-trips primary red', () => {
    const rgb = { r: 255, g: 0, b: 0, a: 1 }
    const hsl = rgbToHsl(rgb)
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)
    expect(hsl.l).toBe(50)
    const back = hslToRgb(hsl)
    expect(back.r).toBe(255)
    expect(back.g).toBe(0)
    expect(back.b).toBe(0)
  })
  it('round-trips arbitrary color within 1 unit', () => {
    const rgb = { r: 59, g: 130, b: 246, a: 1 }
    const back = hslToRgb(rgbToHsl(rgb))
    expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(1)
    expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(1)
    expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(1)
  })
})

describe('OKLCH round-trip', () => {
  it('round-trips primary red within 2 units', () => {
    const rgb = { r: 255, g: 0, b: 0, a: 1 }
    const back = oklchToRgb(rgbToOklch(rgb))
    expect(Math.abs(back.r - 255)).toBeLessThanOrEqual(2)
    expect(Math.abs(back.g - 0)).toBeLessThanOrEqual(2)
    expect(Math.abs(back.b - 0)).toBeLessThanOrEqual(2)
  })
  it('round-trips mid-tone blue within 2 units', () => {
    const rgb = { r: 59, g: 130, b: 246, a: 1 }
    const back = oklchToRgb(rgbToOklch(rgb))
    expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(2)
    expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(2)
    expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(2)
  })
})

describe('parseColor', () => {
  it('accepts hex, rgb, hsl, oklch', () => {
    expect(parseColor('#3b82f6')?.rgb.r).toBe(59)
    expect(parseColor('rgb(59, 130, 246)')?.rgb.g).toBe(130)
    expect(parseColor('hsl(217, 91%, 60%)')?.hex.startsWith('#')).toBe(true)
    expect(parseColor('oklch(0.6 0.2 250)')?.hex.startsWith('#')).toBe(true)
  })
  it('parses rgba with alpha', () => {
    const v = parseColor('rgba(255, 0, 0, 0.5)')
    expect(v?.alpha).toBeCloseTo(0.5)
  })
  it('returns null for garbage', () => {
    expect(parseColor('not-a-color')).toBeNull()
    expect(parseColor('')).toBeNull()
  })
})

describe('contrast', () => {
  it('black on white ≈ 21:1', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })
  it('white on white ≈ 1:1', () => {
    expect(getContrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 1)
  })
  it('wcagLevel thresholds', () => {
    expect(wcagLevel(21)).toBe('AAA')
    expect(wcagLevel(5)).toBe('AA')
    expect(wcagLevel(3.5)).toBe('AA Large')
    expect(wcagLevel(2)).toBe('Fail')
    expect(wcagLevel(3.5, 'large')).toBe('AA')
  })
})
