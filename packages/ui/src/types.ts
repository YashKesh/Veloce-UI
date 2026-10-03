import type { CSSProperties } from 'react'

export type Size = 'sm' | 'md' | 'lg'
export type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'err'

export const _css = (s: CSSProperties): CSSProperties => s
