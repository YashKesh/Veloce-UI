import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog } from '../Dialog'

describe('Dialog', () => {
  it('renders nothing when open=false', () => {
    render(
      <Dialog open={false} onOpenChange={() => {}} title="t">
        <Dialog.Body>Hi</Dialog.Body>
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText('Hi')).toBeNull()
  })

  it('renders overlay and content when open=true', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="t">
        <Dialog.Body>Hello</Dialog.Body>
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('has role=dialog, aria-modal=true, aria-labelledby linking title id', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="My Title" description="My desc">
        <div />
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const labelledby = dialog.getAttribute('aria-labelledby')
    const describedby = dialog.getAttribute('aria-describedby')
    expect(labelledby).toBeTruthy()
    expect(describedby).toBeTruthy()
    expect(document.getElementById(labelledby!)).toHaveTextContent('My Title')
    expect(document.getElementById(describedby!)).toHaveTextContent('My desc')
  })

  it('clicking backdrop fires onOpenChange(false)', () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Dialog open={true} onOpenChange={onOpenChange} title="t">
        <div />
      </Dialog>,
    )
    const overlay = container.querySelector('[role="presentation"]') as HTMLElement
    // mousedown with target === currentTarget
    fireEvent.mouseDown(overlay, { target: overlay })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('Esc fires onOpenChange(false)', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog open={true} onOpenChange={onOpenChange} title="t">
        <div />
      </Dialog>,
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('focus moves to the dialog panel on open', async () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="t">
        <Dialog.Body>plain</Dialog.Body>
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog')
    await waitFor(() => {
      expect(document.activeElement).toBe(dialog)
    })
  })

  it('body scroll is locked while open and restored when closed', () => {
    document.body.style.overflow = ''
    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button data-testid="close" onClick={() => setOpen(false)}>close</button>
          <Dialog open={open} onOpenChange={setOpen} title="t">
            <div />
          </Dialog>
        </>
      )
    }
    render(<Harness />)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByTestId('close'))
    expect(document.body.style.overflow).toBe('')
  })

  it('Header/Body/Footer compose correctly', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <Dialog.Header>H</Dialog.Header>
        <Dialog.Body>B</Dialog.Body>
        <Dialog.Footer>F</Dialog.Footer>
      </Dialog>,
    )
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
  })

  it('forwardRef returns the dialog panel', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Dialog ref={ref} open={true} onOpenChange={() => {}} title="t">
        <div />
      </Dialog>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('role', 'dialog')
  })

  it('sets data-vl-dialog on panel', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="t">
        <div />
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-vl-dialog')
  })
})
