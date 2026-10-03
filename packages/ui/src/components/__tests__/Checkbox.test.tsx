import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  it('renders', () => {
    render(<Checkbox label="Accept" />)
    expect(screen.getByText('Accept')).toBeInTheDocument()
  })

  it('fires onCheckedChange', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Checkbox label="X" onCheckedChange={fn} />)
    await user.click(screen.getByText('X'))
    expect(fn).toHaveBeenCalledWith(true)
  })

  it('respects indeterminate', () => {
    render(<Checkbox indeterminate data-testid="cb" />)
    const input = screen.getByTestId('cb') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })

  it('applies size', () => {
    const { rerender } = render(<Checkbox size="sm" data-testid="cb" />)
    expect(screen.getByTestId('cb').closest('[data-vl-checkbox]')).toHaveAttribute('data-size', 'sm')
    rerender(<Checkbox size="md" data-testid="cb" />)
    expect(screen.getByTestId('cb').closest('[data-vl-checkbox]')).toHaveAttribute('data-size', 'md')
  })

  it('invalid sets aria-invalid and data-invalid', () => {
    render(<Checkbox invalid data-testid="cb" />)
    const input = screen.getByTestId('cb')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.closest('[data-vl-checkbox]')).toHaveAttribute('data-invalid', '')
  })

  it('disabled prevents interaction', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Checkbox label="X" disabled onCheckedChange={fn} />)
    await user.click(screen.getByText('X'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('forwardRef returns the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('survives global input/span reset (box reads CSS variable)', () => {
    const style = document.createElement('style')
    style.textContent =
      'span, input { background: none !important; border: none !important; color: inherit !important; }'
    document.head.appendChild(style)

    const { container } = render(<Checkbox />)
    const box = container.querySelector('[data-vl-checkbox-box]') as HTMLElement
    expect(box.style.background).toContain('var(--vl-checkbox-bg')
    expect(box.style.border).toContain('var(--vl-checkbox-border')

    document.head.removeChild(style)
  })
})
