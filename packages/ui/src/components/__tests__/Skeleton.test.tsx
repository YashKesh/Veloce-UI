import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '../Skeleton'

describe('Skeleton', () => {
  it('renders with aria-hidden="true"', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('width/height props apply', () => {
    const { container } = render(<Skeleton width={120} height={24} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('120px')
    expect(el.style.height).toBe('24px')
  })

  it('variant="text" uses default text height', () => {
    const { container } = render(<Skeleton variant="text" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.height).toBe('0.9em')
    expect(el.style.width).toBe('100%')
  })

  it('variant="circle" makes it a circle', () => {
    const { container } = render(<Skeleton variant="circle" width={40} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.borderRadius).toBe('50%')
    expect(el.style.width).toBe('40px')
    expect(el.style.height).toBe('40px')
  })
})
