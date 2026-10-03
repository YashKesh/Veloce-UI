import { describe, it, expect } from 'vitest'
import { act, render } from '@testing-library/react'
import { useState } from 'react'
import { Presence, Stagger, NumberFlow } from '../..'

describe('Presence', () => {
  it('renders the child when show is true', () => {
    const { container } = render(
      <Presence show>
        <div data-testid="x">hi</div>
      </Presence>,
    )
    expect(container.querySelector('[data-testid="x"]')).not.toBeNull()
  })

  it('keeps the child mounted after show flips to false until animationend', () => {
    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button onClick={() => setOpen(false)}>close</button>
          <Presence show={open}>
            <div data-testid="x">hi</div>
          </Presence>
        </>
      )
    }
    const { getByText, container } = render(<Harness />)
    act(() => {
      getByText('close').click()
    })
    // still mounted during exit animation
    expect(container.querySelector('[data-testid="x"]')).not.toBeNull()
    // simulate animationend to flush the exit
    const el = container.querySelector('[data-testid="x"]') as HTMLElement
    act(() => {
      el.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(container.querySelector('[data-testid="x"]')).toBeNull()
  })
})

describe('Stagger', () => {
  it('assigns incremental animationDelay to each child', () => {
    const { container } = render(
      <Stagger gap={50}>
        <div data-testid="s">a</div>
        <div data-testid="s">b</div>
        <div data-testid="s">c</div>
      </Stagger>,
    )
    const els = container.querySelectorAll<HTMLElement>('[data-testid="s"]')
    expect(els.length).toBe(3)
    expect(els[0].style.animationDelay).toBe('0ms')
    expect(els[1].style.animationDelay).toBe('50ms')
    expect(els[2].style.animationDelay).toBe('100ms')
  })
})

describe('NumberFlow', () => {
  it('renders a formatted number', () => {
    const { container } = render(<NumberFlow value={1240} />)
    const span = container.querySelector('span')!
    expect(span.textContent).toBe((1240).toLocaleString())
    expect(span.getAttribute('data-vl-number-flow')).toBe('')
  })

  it('accepts a custom formatter', () => {
    const { container } = render(
      <NumberFlow value={0.42} format={(n) => `${(n * 100).toFixed(0)}%`} />,
    )
    expect(container.querySelector('span')!.textContent).toBe('42%')
  })

  it('does not throw when the target value changes', () => {
    function Harness() {
      const [v, setV] = useState(100)
      return (
        <>
          <button onClick={() => setV(500)}>go</button>
          <NumberFlow value={v} durationMs={50} />
        </>
      )
    }
    const { getByText } = render(<Harness />)
    expect(() => act(() => { getByText('go').click() })).not.toThrow()
  })
})
