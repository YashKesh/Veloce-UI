import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '../Textarea'

describe('Textarea', () => {
  it('renders and onChange works', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea placeholder="t" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('t'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('invalid sets aria-invalid', () => {
    render(<Textarea invalid placeholder="t" />)
    expect(screen.getByPlaceholderText('t')).toHaveAttribute('aria-invalid', 'true')
  })

  it('autoResize grows height as content grows', async () => {
    const user = userEvent.setup()
    render(<Textarea autoResize placeholder="t" />)
    const el = screen.getByPlaceholderText('t') as HTMLTextAreaElement
    // Mock scrollHeight since jsdom doesn't layout
    let fakeScroll = 72
    Object.defineProperty(el, 'scrollHeight', {
      configurable: true,
      get() {
        return fakeScroll
      },
    })
    await user.type(el, 'line1')
    fakeScroll = 120
    await user.type(el, '\nline2\nline3')
    expect(el.style.height).toBe('120px')
  })

  it('forwardRef returns the <textarea> DOM node', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('sets data-vl-textarea on root', () => {
    const { container } = render(<Textarea />)
    expect(container.querySelector('[data-vl-textarea]')).not.toBeNull()
  })
})
