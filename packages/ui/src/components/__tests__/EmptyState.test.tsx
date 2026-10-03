import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="Nothing here" description="Try again" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('renders icon slot', () => {
    render(<EmptyState icon={<span data-testid="icon">!</span>} title="t" />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<EmptyState title="t" action={<button>Retry</button>} />)
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<EmptyState>inner</EmptyState>)
    expect(screen.getByText('inner')).toBeInTheDocument()
  })

  it('data-vl-empty-state on root', () => {
    render(<EmptyState data-testid="x" title="t" />)
    expect(screen.getByTestId('x')).toHaveAttribute('data-vl-empty-state')
  })

  it('forwardRef', () => {
    const ref = createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
