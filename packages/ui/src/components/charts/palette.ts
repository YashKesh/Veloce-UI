/** Shared chart series palette. Reads --c-0..--c-5 tokens, which cascade from --ac.
 *  Override by setting --c-0..--c-5 at any scope, or by passing an explicit palette prop. */
export const SERIES_PALETTE: string[] = [
  'var(--c-0)',
  'var(--c-1)',
  'var(--c-2)',
  'var(--c-3)',
  'var(--c-4)',
  'var(--c-5)',
]

export const seriesColor = (i: number): string => SERIES_PALETTE[i % SERIES_PALETTE.length]
