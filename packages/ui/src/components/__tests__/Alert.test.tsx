import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert, type AlertTone } from '../Alert'

describe('Alert', () => {
  it('renders title and children', () => {
    render(<Alert title="Heads up">Body</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('applies distinct bg + accent border per tone', () => {
    const tones: AlertTone[] = ['info', 'ok', 'warn', 'err']
    const seen = new Set<string>()
    for (const t of tones) {
      const { container, unmount } = render(<Alert tone={t}>x</Alert>)
      const el = container.firstChild as HTMLElement
      seen.add(`${el.style.background}|${el.style.border}`)
      unmount()
    }
    expect(seen.size).toBe(tones.length)
  })

  it('onDismiss renders close button that fires callback', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert onDismiss={onDismiss}>x</Alert>)
    const btn = screen.getByRole('button', { name: 'Dismiss' })
    await user.click(btn)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('no close button when onDismiss is not provided', () => {
    render(<Alert>x</Alert>)
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull()
  })

  it('role="alert" on the root', () => {
    render(<Alert>x</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('forwardRef returns the root <div>', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Alert ref={ref}>x</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('role', 'alert')
  })

  it('sets data-vl-alert on root', () => {
    const { container } = render(<Alert>x</Alert>)
    expect(container.querySelector('[data-vl-alert]')).not.toBeNull()
  })
})
