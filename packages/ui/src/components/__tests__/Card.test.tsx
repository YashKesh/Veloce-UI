import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>content</Card>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('padding sm/md/lg apply different padding values', () => {
    const { container, rerender } = render(<Card padding="sm">x</Card>)
    const pSm = (container.firstChild as HTMLElement).style.padding
    rerender(<Card padding="md">x</Card>)
    const pMd = (container.firstChild as HTMLElement).style.padding
    rerender(<Card padding="lg">x</Card>)
    const pLg = (container.firstChild as HTMLElement).style.padding
    expect(pSm).not.toBe(pMd)
    expect(pMd).not.toBe(pLg)
    expect(pSm).toBe('12px')
    expect(pMd).toBe('20px')
    expect(pLg).toBe('28px')
  })

  it('elevated adds a shadow', () => {
    const { container, rerender } = render(<Card>x</Card>)
    const flat = (container.firstChild as HTMLElement).style.boxShadow
    rerender(<Card elevated>x</Card>)
    const elev = (container.firstChild as HTMLElement).style.boxShadow
    expect(flat).toBe('')
    expect(elev).not.toBe('')
    expect(elev).toContain('var(--shadow-md)')
  })

  it('Header/Body/Footer render and compose correctly', () => {
    render(
      <Card>
        <Card.Header>Head</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    )
    expect(screen.getByText('Head')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Foot')).toBeInTheDocument()
  })

  it('sets data-vl-card and data-elevated on root', () => {
    const { container } = render(<Card elevated>hi</Card>)
    const root = container.querySelector('[data-vl-card]') as HTMLElement
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute('data-elevated')
  })
})
