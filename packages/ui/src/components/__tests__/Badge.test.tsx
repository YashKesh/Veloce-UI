import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge, type BadgeTone, type BadgeVariant } from '../Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Hi</Badge>)
    expect(screen.getByText('Hi')).toBeInTheDocument()
  })

  it('applies distinct colors per tone (solid)', () => {
    const tones: BadgeTone[] = ['neutral', 'accent', 'ok', 'warn', 'err']
    const bgs = new Set<string>()
    for (const t of tones) {
      const { container, unmount } = render(
        <Badge tone={t} variant="solid">
          x
        </Badge>,
      )
      const span = container.querySelector('span') as HTMLElement
      bgs.add(span.style.background)
      unmount()
    }
    expect(bgs.size).toBe(tones.length)
  })

  it('applies distinct styles per variant', () => {
    const variants: BadgeVariant[] = ['solid', 'soft', 'outline']
    const seen = new Set<string>()
    for (const v of variants) {
      const { container, unmount } = render(
        <Badge tone="accent" variant={v}>
          x
        </Badge>,
      )
      const span = container.querySelector('span') as HTMLElement
      seen.add(`${span.style.background}|${span.style.border}`)
      unmount()
    }
    expect(seen.size).toBe(variants.length)
  })

  it('sets data-vl-badge on root', () => {
    const { container } = render(<Badge>x</Badge>)
    expect(container.querySelector('[data-vl-badge]')).not.toBeNull()
  })
})
