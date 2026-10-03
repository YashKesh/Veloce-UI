import { useState } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover } from '../Popover'

function Harness() {
  const [o, setO] = useState(false)
  return (
    <Popover open={o} onOpenChange={setO}>
      <Popover.Trigger><button>Open</button></Popover.Trigger>
      <Popover.Content>Panel</Popover.Content>
    </Popover>
  )
}

describe('Popover', () => {
  it('is closed by default', () => {
    render(<Harness />)
    expect(screen.queryByText('Panel')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    expect(screen.getByText('Panel')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    await user.keyboard('{Escape}')
    expect(screen.queryByText('Panel')).not.toBeInTheDocument()
  })

  it('closes on outside click', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Harness />
        <div data-testid="outside">outside</div>
      </div>,
    )
    await user.click(screen.getByText('Open'))
    await user.click(screen.getByTestId('outside'))
    expect(screen.queryByText('Panel')).not.toBeInTheDocument()
  })

  it('aria-expanded on trigger', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const trig = screen.getByText('Open')
    expect(trig).toHaveAttribute('aria-expanded', 'false')
    await user.click(trig)
    expect(trig).toHaveAttribute('aria-expanded', 'true')
  })

  it('content has role=dialog', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
