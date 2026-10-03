import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from '../Progress'

describe('Progress', () => {
  it('renders with aria role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('determinate sets aria-valuenow', () => {
    render(<Progress value={37} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '37')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps out-of-range values', () => {
    render(<Progress value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('indeterminate when no value', () => {
    render(<Progress />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('data-indeterminate')
    expect(bar).not.toHaveAttribute('aria-valuenow')
  })

  it('max prop is honored', () => {
    render(<Progress value={5} max={10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10')
  })

  it('forwardRef', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={0} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
