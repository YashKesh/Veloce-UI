import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownMenu } from '../DropdownMenu'

function Harness({ onSelect }: { onSelect?: (v: string) => void }) {
  const [o, setO] = useState(false)
  return (
    <DropdownMenu open={o} onOpenChange={setO}>
      <DropdownMenu.Trigger><button>Open</button></DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onSelect={() => onSelect?.('a')}>Alpha</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => onSelect?.('b')}>Beta</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item disabled>Gamma</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('selecting item fires onSelect and closes', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Harness onSelect={fn} />)
    await user.click(screen.getByText('Open'))
    await user.click(screen.getByText('Alpha'))
    expect(fn).toHaveBeenCalledWith('a')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('Escape closes', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('arrow keys navigate items', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    // first item should be auto-focused
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent).toBe('Beta')
  })

  it('disabled item not activated', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Harness onSelect={fn} />)
    await user.click(screen.getByText('Open'))
    await user.click(screen.getByText('Gamma'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('separator renders with role=separator', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('items have role=menuitem', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThanOrEqual(3)
  })
})
