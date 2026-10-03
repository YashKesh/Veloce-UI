import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  })

  it('fires onChange on typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input placeholder="x" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('x'), 'ab')
    expect(onChange).toHaveBeenCalled()
  })

  it('controlled round-trip works', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [v, setV] = useState('')
      return (
        <Input
          placeholder="n"
          value={v}
          onChange={(e) => setV(e.target.value)}
          data-testid="in"
        />
      )
    }
    render(<Controlled />)
    const input = screen.getByTestId('in') as HTMLInputElement
    await user.type(input, 'hi')
    expect(input.value).toBe('hi')
  })

  it('invalid adds red border and aria-invalid=true', () => {
    render(<Input invalid placeholder="e" />)
    const input = screen.getByPlaceholderText('e')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const wrap = input.parentElement as HTMLElement
    expect(wrap.style.border).toContain('var(--err)')
  })

  it('size sm/md changes wrapper height', () => {
    const { rerender } = render(<Input placeholder="a" size="sm" />)
    const smH = (screen.getByPlaceholderText('a').parentElement as HTMLElement).style.height
    rerender(<Input placeholder="a" size="md" />)
    const mdH = (screen.getByPlaceholderText('a').parentElement as HTMLElement).style.height
    expect(smH).toBe('30px')
    expect(mdH).toBe('36px')
    expect(smH).not.toBe(mdH)
  })

  it('prefix/suffix render inside the field', () => {
    render(
      <Input
        placeholder="x"
        prefix={<span data-testid="pre">P</span>}
        suffix={<span data-testid="suf">S</span>}
      />,
    )
    expect(screen.getByTestId('pre')).toBeInTheDocument()
    expect(screen.getByTestId('suf')).toBeInTheDocument()
  })

  it('disabled prevents typing', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="x" disabled />)
    const input = screen.getByPlaceholderText('x') as HTMLInputElement
    expect(input).toBeDisabled()
    await user.type(input, 'nope')
    expect(input.value).toBe('')
  })

  it('forwardRef returns the <input> DOM node', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="x" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('sets data-vl-input on wrapper', () => {
    const { container } = render(<Input placeholder="x" />)
    expect(container.querySelector('[data-vl-input]')).not.toBeNull()
  })

  it('survives global input/span reset (inline style reads CSS variable)', () => {
    const style = document.createElement('style')
    style.textContent =
      'span, input { background: none !important; border: none !important; color: inherit !important; }'
    document.head.appendChild(style)

    const { container } = render(<Input placeholder="x" />)
    const wrap = container.querySelector('[data-vl-input]') as HTMLElement
    expect(wrap.style.background).toContain('var(--vl-input-bg')
    expect(wrap.style.border).toContain('var(--vl-input-border')

    document.head.removeChild(style)
  })
})
