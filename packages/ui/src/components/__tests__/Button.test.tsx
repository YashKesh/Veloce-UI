import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies distinct data-variant for each variant', () => {
    const { rerender } = render(<Button data-testid="btn">Primary</Button>)
    expect(screen.getByTestId('btn').getAttribute('data-variant')).toBe('primary')

    rerender(
      <Button variant="ghost" data-testid="btn">
        Ghost
      </Button>,
    )
    expect(screen.getByTestId('btn').getAttribute('data-variant')).toBe('ghost')

    rerender(
      <Button variant="outline" data-testid="btn">
        Outline
      </Button>,
    )
    expect(screen.getByTestId('btn').getAttribute('data-variant')).toBe('outline')

    rerender(
      <Button variant="destructive" data-testid="btn">
        Destructive
      </Button>,
    )
    expect(screen.getByTestId('btn').getAttribute('data-variant')).toBe('destructive')
  })

  it('applies distinct sizes', () => {
    const { rerender } = render(
      <Button size="sm" data-testid="btn">
        A
      </Button>,
    )
    const sm = screen.getByTestId('btn').style.height
    rerender(
      <Button size="md" data-testid="btn">
        A
      </Button>,
    )
    const md = screen.getByTestId('btn').style.height
    rerender(
      <Button size="lg" data-testid="btn">
        A
      </Button>,
    )
    const lg = screen.getByTestId('btn').style.height
    expect(sm).not.toBe(md)
    expect(md).not.toBe(lg)
    expect(sm).toBe('30px')
    expect(md).toBe('36px')
    expect(lg).toBe('44px')
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled prevents clicks and sets disabled attribute', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    )
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn).toBeDisabled()
    await user.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('isLoading renders spinner and disables interaction', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button isLoading onClick={onClick}>
        Go
      </Button>,
    )
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn).toBeDisabled()
    // Spinner span is first child with animation containing vl-spin
    const spinner = btn.querySelector('span[aria-hidden]') as HTMLElement
    expect(spinner).toBeTruthy()
    expect(spinner.style.animation).toContain('vl-spin')
    await user.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders leftIcon and rightIcon in correct position', () => {
    render(
      <Button leftIcon={<span data-testid="L">L</span>} rightIcon={<span data-testid="R">R</span>}>
        Mid
      </Button>,
    )
    const btn = screen.getByRole('button')
    const text = btn.textContent ?? ''
    expect(text.indexOf('L')).toBeLessThan(text.indexOf('Mid'))
    expect(text.indexOf('Mid')).toBeLessThan(text.indexOf('R'))
  })

  it('forwardRef returns the button node', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Hi</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('sets data-vl-btn on root', () => {
    render(<Button>Hi</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-vl-btn')
  })

  it('spreads unknown HTML props to the root', () => {
    render(
      <Button data-testid="btn" aria-label="hello">
        X
      </Button>,
    )
    const btn = screen.getByTestId('btn')
    expect(btn).toHaveAttribute('aria-label', 'hello')
  })

  it('survives global button reset (inline style reads CSS variable)', () => {
    const style = document.createElement('style')
    style.textContent = 'button { background: none !important; border: none !important; color: inherit !important; }'
    document.head.appendChild(style)

    render(<Button data-testid="btn" variant="primary">Hi</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.style.background).not.toBe('')
    expect(btn.style.background).toContain('var(--vl-btn-bg')

    document.head.removeChild(style)
  })
})
