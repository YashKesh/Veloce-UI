import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumbs } from '../Breadcrumbs'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Breadcrumbs' },
]

describe('Breadcrumbs', () => {
  it('renders all items', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
    expect(screen.getByText('Breadcrumbs')).toBeInTheDocument()
  })

  it('aria-current on last item', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Breadcrumbs')).toHaveAttribute('aria-current', 'page')
  })

  it('non-last items with href render as link', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Home').tagName).toBe('A')
    expect(screen.getByText('Docs').tagName).toBe('A')
  })

  it('last item without href is a span', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Breadcrumbs').tagName).toBe('SPAN')
  })

  it('custom separator', () => {
    render(<Breadcrumbs items={items} separator=">" />)
    expect(screen.getAllByText('>', { exact: true }).length).toBeGreaterThan(0)
  })

  it('has nav/aria-label', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb')
  })
})
