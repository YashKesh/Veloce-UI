import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '../Tabs'

function Harness({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState('one')
  return (
    <Tabs value={v} onValueChange={(x) => { setV(x); onChange?.(x) }}>
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
        <Tabs.Trigger value="three">Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">Body one</Tabs.Content>
      <Tabs.Content value="two">Body two</Tabs.Content>
      <Tabs.Content value="three">Body three</Tabs.Content>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders active content', () => {
    render(<Harness />)
    expect(screen.getByText('Body one')).toBeInTheDocument()
    expect(screen.queryByText('Body two')).not.toBeInTheDocument()
  })

  it('clicking trigger switches content', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Harness onChange={fn} />)
    await user.click(screen.getByText('Two'))
    expect(fn).toHaveBeenCalledWith('two')
    expect(screen.getByText('Body two')).toBeInTheDocument()
  })

  it('arrow keys move focus', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const t1 = screen.getByText('One').closest('button') as HTMLButtonElement
    t1.focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement?.textContent).toBe('Two')
  })

  it('aria-selected reflects state', () => {
    render(<Harness />)
    expect(screen.getByText('One').closest('button')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Two').closest('button')).toHaveAttribute('aria-selected', 'false')
  })

  it('tablist / tab roles present', () => {
    render(<Harness />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab').length).toBe(3)
  })

  it('tabpanel rendered', () => {
    render(<Harness />)
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })
})
