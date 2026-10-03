import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('default renders a circle with role="status" and aria-label="Loading"', () => {
    render(<Spinner />)
    const s = screen.getByRole('status')
    expect(s).toHaveAttribute('aria-label', 'Loading')
    expect((s as HTMLElement).style.borderRadius).toBe('50%')
  })

  it('size prop controls width/height', () => {
    const { rerender } = render(<Spinner size={16} />)
    let el = screen.getByRole('status') as HTMLElement
    expect(el.style.width).toBe('16px')
    expect(el.style.height).toBe('16px')
    rerender(<Spinner size={32} />)
    el = screen.getByRole('status') as HTMLElement
    expect(el.style.width).toBe('32px')
    expect(el.style.height).toBe('32px')
  })

  it('color prop sets color (controls borderColor via currentColor)', () => {
    render(<Spinner color="#ff0000" />)
    const el = screen.getByRole('status') as HTMLElement
    expect(el.style.color).toBe('rgb(255, 0, 0)')
    // 3-sided border via currentColor + transparent right
    expect(el.style.border).toContain('currentcolor')
    expect(el.style.borderRightColor).toBe('transparent')
  })

  it('animation uses vl-spin', () => {
    render(<Spinner />)
    const el = screen.getByRole('status') as HTMLElement
    expect(el.style.animation).toContain('vl-spin')
  })
})
