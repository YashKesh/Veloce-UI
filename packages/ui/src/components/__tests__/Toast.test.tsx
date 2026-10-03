import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from '../Toast'

function Harness({ onReady }: { onReady: (t: ReturnType<typeof useToast>) => void }) {
  const t = useToast()
  onReady(t)
  return null
}

let currentApi: ReturnType<typeof useToast> | null = null
function Grab() {
  currentApi = useToast()
  return null
}

describe('Toast', () => {
  beforeEach(() => {
    // Reset shared module state between tests via a one-off render
    render(<Grab />)
    act(() => {
      currentApi?.dismissAll()
    })
  })

  it('ToastProvider renders nothing when no toasts', () => {
    render(<ToastProvider />)
    expect(document.querySelector('[data-vl-toast]')).toBeNull()
  })

  it('push shows toast with title + description', () => {
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'Hello', description: 'World', duration: 0 })
    })
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('World')).toBeInTheDocument()
    act(() => {
      api!.dismissAll()
    })
  })

  it('info uses role=status aria-live=polite; err uses role=alert aria-live=assertive', () => {
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'i', tone: 'info', duration: 0 })
      api!({ title: 'e', tone: 'err', duration: 0 })
    })
    const info = screen.getByText('i').closest('[data-vl-toast]')!
    const err = screen.getByText('e').closest('[data-vl-toast]')!
    expect(info).toHaveAttribute('role', 'status')
    expect(info).toHaveAttribute('aria-live', 'polite')
    expect(err).toHaveAttribute('role', 'alert')
    expect(err).toHaveAttribute('aria-live', 'assertive')
    act(() => {
      api!.dismissAll()
    })
  })

  it('dismiss(id) removes a specific toast', () => {
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    let idA = ''
    act(() => {
      idA = api!({ title: 'A', duration: 0 })
      api!({ title: 'B', duration: 0 })
    })
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    act(() => {
      api!.dismiss(idA)
    })
    expect(screen.queryByText('A')).toBeNull()
    expect(screen.getByText('B')).toBeInTheDocument()
    act(() => {
      api!.dismissAll()
    })
  })

  it('dismissAll clears every toast', () => {
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'A', duration: 0 })
      api!({ title: 'B', duration: 0 })
    })
    act(() => {
      api!.dismissAll()
    })
    expect(screen.queryByText('A')).toBeNull()
    expect(screen.queryByText('B')).toBeNull()
  })

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers()
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'timed', duration: 500 })
    })
    expect(screen.getByText('timed')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(screen.queryByText('timed')).toBeNull()
    vi.useRealTimers()
  })

  it('duration=0 never auto-dismisses', () => {
    vi.useFakeTimers()
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'sticky', duration: 0 })
    })
    act(() => {
      vi.advanceTimersByTime(20000)
    })
    expect(screen.getByText('sticky')).toBeInTheDocument()
    act(() => {
      api!.dismissAll()
    })
    vi.useRealTimers()
  })

  it('action button fires onClick and dismisses', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'A', duration: 0, action: { label: 'Undo', onClick } })
    })
    await user.click(screen.getByText('Undo'))
    expect(onClick).toHaveBeenCalled()
    expect(screen.queryByText('A')).toBeNull()
  })

  it('close button dismisses the toast', async () => {
    const user = userEvent.setup()
    let api: ReturnType<typeof useToast> | null = null
    render(
      <>
        <ToastProvider />
        <Harness onReady={(t) => (api = t)} />
      </>,
    )
    act(() => {
      api!({ title: 'xclose', duration: 0 })
    })
    await user.click(screen.getByLabelText('Dismiss'))
    expect(screen.queryByText('xclose')).toBeNull()
  })
})
