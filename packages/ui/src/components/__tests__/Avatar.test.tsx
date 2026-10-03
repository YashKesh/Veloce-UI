import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Avatar } from '../Avatar'

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByText('AL')).toBeInTheDocument()
  })

  it('renders <img> with alt=name when src is provided', () => {
    render(<Avatar name="Ada Lovelace" src="https://example.com/a.png" />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Ada Lovelace')
    expect(img.src).toContain('example.com')
  })

  it('applies different px dimensions for each size', () => {
    const { container, rerender } = render(<Avatar name="A B" size="sm" />)
    const sm = (container.firstChild as HTMLElement).style.width
    rerender(<Avatar name="A B" size="md" />)
    const md = (container.firstChild as HTMLElement).style.width
    rerender(<Avatar name="A B" size="lg" />)
    const lg = (container.firstChild as HTMLElement).style.width
    expect(sm).toBe('24px')
    expect(md).toBe('36px')
    expect(lg).toBe('48px')

    rerender(<Avatar name="A B" size={64} />)
    expect((container.firstChild as HTMLElement).style.width).toBe('64px')
  })

  it('custom hue sets a background color', () => {
    const { container } = render(<Avatar name="A B" hue={10} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.background).toContain('oklch')
    expect(el.style.background).toContain('10')
  })

  it('falls back to initials if src fails to load', () => {
    render(<Avatar name="Ada Lovelace" src="bad.png" />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('sets data-vl-avatar on root', () => {
    const { container } = render(<Avatar name="Ada" />)
    expect(container.querySelector('[data-vl-avatar]')).not.toBeNull()
  })
})
