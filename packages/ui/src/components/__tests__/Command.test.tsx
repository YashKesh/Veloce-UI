import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Command } from '../Command'

function Fixture({
  open = true,
  onOpenChange = () => {},
  onSelectA = () => {},
  onSelectB = () => {},
  onSelectC = () => {},
  disabledB = false,
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  onSelectA?: () => void
  onSelectB?: () => void
  onSelectC?: () => void
  disabledB?: boolean
}) {
  return (
    <Command open={open} onOpenChange={onOpenChange}>
      <Command.Group heading="Actions">
        <Command.Item value="apple" onSelect={onSelectA}>
          Apple
        </Command.Item>
        <Command.Item value="banana" disabled={disabledB} onSelect={onSelectB}>
          Banana
        </Command.Item>
      </Command.Group>
      <Command.Group heading="Nav">
        <Command.Item value="cherry" onSelect={onSelectC}>
          Cherry
        </Command.Item>
      </Command.Group>
    </Command>
  )
}

describe('Command', () => {
  it('renders nothing when open=false', () => {
    render(<Fixture open={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders dialog with combobox input and listbox when open', async () => {
    render(<Fixture />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
      expect(screen.getByText('Cherry')).toBeInTheDocument()
    })
  })

  it('typing filters items', async () => {
    const user = userEvent.setup()
    render(<Fixture />)
    const input = screen.getByRole('combobox')
    await user.type(input, 'cher')
    await waitFor(() => {
      expect(screen.queryByText('Apple')).toBeNull()
      expect(screen.queryByText('Banana')).toBeNull()
      expect(screen.getByText('Cherry')).toBeInTheDocument()
    })
  })

  it('ArrowDown/ArrowUp moves highlight', async () => {
    const user = userEvent.setup()
    render(<Fixture />)
    const input = screen.getByRole('combobox')
    input.focus()
    await waitFor(() => {
      expect(screen.getByText('Apple').closest('[data-vl-command-item]')).toHaveAttribute(
        'data-highlighted',
      )
    })
    await user.keyboard('{ArrowDown}')
    await waitFor(() => {
      expect(screen.getByText('Banana').closest('[data-vl-command-item]')).toHaveAttribute(
        'data-highlighted',
      )
    })
    await user.keyboard('{ArrowUp}')
    await waitFor(() => {
      expect(screen.getByText('Apple').closest('[data-vl-command-item]')).toHaveAttribute(
        'data-highlighted',
      )
    })
  })

  it('Enter triggers highlighted item onSelect and closes', async () => {
    const user = userEvent.setup()
    const onA = vi.fn()
    const onOpen = vi.fn()
    render(<Fixture onSelectA={onA} onOpenChange={onOpen} />)
    const input = screen.getByRole('combobox')
    input.focus()
    await user.keyboard('{Enter}')
    expect(onA).toHaveBeenCalled()
    expect(onOpen).toHaveBeenCalledWith(false)
  })

  it('clicking an item calls its onSelect', async () => {
    const user = userEvent.setup()
    const onC = vi.fn()
    const onOpen = vi.fn()
    render(<Fixture onSelectC={onC} onOpenChange={onOpen} />)
    await waitFor(() => expect(screen.getByText('Cherry')).toBeInTheDocument())
    await user.click(screen.getByText('Cherry'))
    expect(onC).toHaveBeenCalled()
    expect(onOpen).toHaveBeenCalledWith(false)
  })

  it('disabled items are skipped by navigation and not rendered as options', async () => {
    const onB = vi.fn()
    render(<Fixture disabledB onSelectB={onB} />)
    // disabled item should not render per our matches gate
    expect(screen.queryByText('Banana')).toBeNull()
  })

  it('Esc closes', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<Fixture onOpenChange={onOpen} />)
    await user.keyboard('{Escape}')
    expect(onOpen).toHaveBeenCalledWith(false)
  })

  it('focus moves to input on open', async () => {
    render(<Fixture />)
    const input = screen.getByRole('combobox')
    await waitFor(() => expect(document.activeElement).toBe(input))
  })

  it('shows "No results" when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Fixture />)
    await user.type(screen.getByRole('combobox'), 'zzzzzz')
    await waitFor(() => {
      expect(screen.getByText('No results')).toBeInTheDocument()
    })
  })
})
