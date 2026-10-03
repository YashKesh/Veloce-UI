import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sheet } from '../Sheet'

describe('Sheet', () => {
  it('renders nothing when open=false', () => {
    render(
      <Sheet open={false} onOpenChange={() => {}} title="t">
        <Sheet.Body>hi</Sheet.Body>
      </Sheet>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders panel + backdrop when open=true', () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} title="t">
        <Sheet.Body>hello</Sheet.Body>
      </Sheet>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('has role=dialog, aria-modal, aria-labelledby wired to title', () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} title="My Sheet" description="desc here">
        <div />
      </Sheet>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const lb = dialog.getAttribute('aria-labelledby')
    const db = dialog.getAttribute('aria-describedby')
    expect(lb).toBeTruthy()
    expect(db).toBeTruthy()
    expect(document.getElementById(lb!)).toHaveTextContent('My Sheet')
    expect(document.getElementById(db!)).toHaveTextContent('desc here')
  })

  it('Esc fires onOpenChange(false)', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="t">
        <div />
      </Sheet>,
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('backdrop click closes', () => {
    const onOpenChange = vi.fn()
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="t">
        <div />
      </Sheet>,
    )
    const backdrop = document.querySelector('[data-vl-sheet-backdrop]') as HTMLElement
    expect(backdrop).toBeTruthy()
    fireEvent.mouseDown(backdrop, { target: backdrop })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('focus moves to panel on open', async () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} title="t">
        <Sheet.Body>b</Sheet.Body>
      </Sheet>,
    )
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(document.activeElement).toBe(dialog))
  })

  it('body scroll locked while open, restored on close', () => {
    document.body.style.overflow = ''
    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button data-testid="close" onClick={() => setOpen(false)}>
            x
          </button>
          <Sheet open={open} onOpenChange={setOpen} title="t">
            <div />
          </Sheet>
        </>
      )
    }
    render(<Harness />)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByTestId('close'))
    expect(document.body.style.overflow).toBe('')
  })

  it('sets data-vl-sheet-panel and data-side on panel', () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} side="left" title="t">
        <div />
      </Sheet>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('data-vl-sheet-panel')
    expect(dialog).toHaveAttribute('data-side', 'left')
  })

  it('renders Header/Body/Footer composition', () => {
    render(
      <Sheet open={true} onOpenChange={() => {}}>
        <Sheet.Header>H</Sheet.Header>
        <Sheet.Body>B</Sheet.Body>
        <Sheet.Footer>F</Sheet.Footer>
      </Sheet>,
    )
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
  })
})
