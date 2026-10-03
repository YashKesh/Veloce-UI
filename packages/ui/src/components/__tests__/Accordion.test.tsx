import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '../Accordion'

function Single({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState('')
  return (
    <Accordion type="single" value={v} onValueChange={(x) => { setV(x); onChange?.(x) }}>
      <Accordion.Item value="a">
        <Accordion.Trigger>Trig A</Accordion.Trigger>
        <Accordion.Content>Content A</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Trig B</Accordion.Trigger>
        <Accordion.Content>Content B</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('renders triggers', () => {
    render(<Single />)
    expect(screen.getByText('Trig A')).toBeInTheDocument()
    expect(screen.getByText('Trig B')).toBeInTheDocument()
  })

  it('clicking trigger opens content', async () => {
    const user = userEvent.setup()
    render(<Single />)
    await user.click(screen.getByText('Trig A'))
    expect(screen.getByText('Content A')).toBeInTheDocument()
  })

  it('single: opens one at a time', async () => {
    const user = userEvent.setup()
    render(<Single />)
    await user.click(screen.getByText('Trig A'))
    await user.click(screen.getByText('Trig B'))
    expect(screen.queryByText('Content A')).not.toBeInTheDocument()
    expect(screen.getByText('Content B')).toBeInTheDocument()
  })

  it('arrow keys move focus between triggers', async () => {
    const user = userEvent.setup()
    render(<Single />)
    const t = screen.getByText('Trig A').closest('button') as HTMLButtonElement
    t.focus()
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent?.includes('Trig B')).toBe(true)
  })

  it('aria-expanded reflects state', async () => {
    const user = userEvent.setup()
    render(<Single />)
    const btn = screen.getByText('Trig A').closest('button')!
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('fires onValueChange', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Single onChange={fn} />)
    await user.click(screen.getByText('Trig A'))
    expect(fn).toHaveBeenCalledWith('a')
  })
})
