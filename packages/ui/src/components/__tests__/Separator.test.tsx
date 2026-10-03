import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Separator } from '../Separator'

describe('Separator', () => {
  it('default is horizontal, role="separator"', () => {
    render(<Separator />)
    const sep = screen.getByRole('separator')
    expect(sep).toBeInTheDocument()
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal')
    expect((sep as HTMLElement).style.height).toBe('1px')
    expect((sep as HTMLElement).style.width).toBe('100%')
  })

  it('orientation="vertical" applies vertical dims and aria-orientation', () => {
    render(<Separator orientation="vertical" />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
    expect((sep as HTMLElement).style.width).toBe('1px')
    expect((sep as HTMLElement).style.alignSelf).toBe('stretch')
  })

  it('inset applies margin', () => {
    const { rerender } = render(<Separator inset={12} />)
    const h = screen.getByRole('separator') as HTMLElement
    expect(h.style.marginLeft).toBe('12px')
    expect(h.style.marginRight).toBe('12px')
    rerender(<Separator orientation="vertical" inset={10} />)
    const v = screen.getByRole('separator') as HTMLElement
    expect(v.style.marginTop).toBe('10px')
    expect(v.style.marginBottom).toBe('10px')
  })
})
