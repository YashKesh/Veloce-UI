import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '../Switch'

describe('Switch', () => {
  it('renders', () => {
    render(<Switch checked={false} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('aria-checked reflects state', () => {
    const { rerender } = render(<Switch checked={false} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    rerender(<Switch checked={true} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Switch checked={false} onCheckedChange={fn} />)
    await user.click(screen.getByRole('switch'))
    expect(fn).toHaveBeenCalledWith(true)
  })

  it('space key toggles', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Switch checked={false} onCheckedChange={fn} />)
    const sw = screen.getByRole('switch')
    sw.focus()
    await user.keyboard(' ')
    expect(fn).toHaveBeenCalledWith(true)
  })

  it('arrow keys set state', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Switch checked={false} onCheckedChange={fn} />)
    const sw = screen.getByRole('switch')
    sw.focus()
    await user.keyboard('{ArrowRight}')
    expect(fn).toHaveBeenLastCalledWith(true)
    await user.keyboard('{ArrowLeft}')
    expect(fn).toHaveBeenLastCalledWith(false)
  })

  it('size prop reflected', () => {
    render(<Switch checked={false} size="sm" />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'sm')
  })

  it('disabled prevents clicks', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Switch checked={false} disabled onCheckedChange={fn} />)
    await user.click(screen.getByRole('switch'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('forwardRef', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch ref={ref} checked={false} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
