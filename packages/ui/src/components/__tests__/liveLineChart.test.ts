import { describe, it, expect } from 'vitest'
import { decimate } from '../charts/LiveLineChart'

describe('decimate', () => {
  it('returns the array when below target', () => {
    expect(decimate([1, 2, 3], 10)).toEqual([1, 2, 3])
  })
  it('samples down evenly', () => {
    const result = decimate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 5)
    expect(result.length).toBe(5)
    expect(result[0]).toBe(0)
    expect(result[result.length - 1]).toBeGreaterThanOrEqual(7)
  })
  it('returns input when target <= 0', () => {
    expect(decimate([1, 2, 3], 0)).toEqual([1, 2, 3])
  })
})
