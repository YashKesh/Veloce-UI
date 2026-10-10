import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'
import { Badge } from '../Badge'
import { Chip } from '../Chip'
import { Card } from '../Card'
import { Avatar } from '../Avatar'
import { Separator } from '../Separator'
import { Input } from '../Input'
import { Textarea } from '../Textarea'
import { Spinner } from '../Spinner'
import { Skeleton } from '../Skeleton'
import { Alert } from '../Alert'
import { Dialog } from '../Dialog'

describe('customization — style + className merging', () => {
  it('Button merges style and className with library defaults', () => {
    render(
      <Button
        data-testid="x"
        style={{ background: 'rgb(255, 0, 0)' }}
        className="my-btn"
      >
        X
      </Button>,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(255, 0, 0)')
    expect(el.style.height).toBe('36px') // library default preserved
    expect(el.className).toContain('vl-btn')
    expect(el.className).toContain('my-btn')
  })

  it('Badge merges style and className with library defaults', () => {
    render(
      <Badge data-testid="x" style={{ background: 'rgb(0, 255, 0)' }} className="my-badge">
        X
      </Badge>,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(0, 255, 0)')
    expect(el.style.height).toBe('20px')
    expect(el.className).toContain('vl-badge')
    expect(el.className).toContain('my-badge')
  })

  it('Chip merges style and className with library defaults', () => {
    render(
      <Chip data-testid="x" style={{ background: 'rgb(0, 0, 255)' }} className="my-chip">
        X
      </Chip>,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(0, 0, 255)')
    expect(el.style.height).toBe('24px')
    expect(el.className).toContain('vl-chip')
    expect(el.className).toContain('my-chip')
  })

  it('Card merges style and className (incl. subparts)', () => {
    render(
      <Card data-testid="root" style={{ background: 'rgb(1, 1, 1)' }} className="my-card">
        <Card.Header data-testid="h" className="my-h">H</Card.Header>
        <Card.Body data-testid="b" className="my-b">B</Card.Body>
        <Card.Footer data-testid="f" className="my-f">F</Card.Footer>
      </Card>,
    )
    const root = screen.getByTestId('root')
    expect(root.style.background).toBe('rgb(1, 1, 1)')
    expect(root.style.borderRadius).toContain('var(--r-xl)')
    expect(root.className).toContain('vl-card')
    expect(root.className).toContain('my-card')
    expect(screen.getByTestId('h').className).toContain('vl-card__header')
    expect(screen.getByTestId('b').className).toContain('vl-card__body')
    expect(screen.getByTestId('f').className).toContain('vl-card__footer')
  })

  it('Avatar merges style and className with library defaults', () => {
    render(
      <Avatar
        name="John Doe"
        data-testid="x"
        style={{ background: 'rgb(10, 10, 10)' }}
        className="my-avatar"
      />,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(10, 10, 10)')
    expect(el.style.borderRadius).toBe('50%')
    expect(el.className).toContain('vl-avatar')
    expect(el.className).toContain('my-avatar')
  })

  it('Separator merges style and className with library defaults', () => {
    render(
      <Separator
        data-testid="x"
        style={{ background: 'rgb(20, 20, 20)' }}
        className="my-sep"
      />,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(20, 20, 20)')
    expect(el.style.height).toBe('1px')
    expect(el.className).toContain('vl-separator')
    expect(el.className).toContain('my-sep')
  })

  it('Input merges style and className on wrapper', () => {
    render(
      <Input
        data-testid="inp"
        style={{ background: 'rgb(30, 30, 30)' }}
        className="my-input"
      />,
    )
    // the wrapper carries data-vl-input; the inner input gets data-testid via rest
    const inner = screen.getByTestId('inp')
    const wrapper = inner.parentElement as HTMLElement
    expect(wrapper.style.background).toBe('rgb(30, 30, 30)')
    expect(wrapper.style.height).toBe('36px')
    expect(wrapper.className).toContain('vl-input')
    expect(wrapper.className).toContain('my-input')
  })

  it('Textarea merges style and className with library defaults', () => {
    render(
      <Textarea
        data-testid="x"
        style={{ background: 'rgb(40, 40, 40)' }}
        className="my-ta"
      />,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(40, 40, 40)')
    expect(el.style.minHeight).toBe('72px')
    expect(el.className).toContain('vl-textarea')
    expect(el.className).toContain('my-ta')
  })

  it('Spinner merges style and className with library defaults', () => {
    render(
      <Spinner
        data-testid="x"
        style={{ background: 'rgb(50, 50, 50)' }}
        className="my-sp"
      />,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(50, 50, 50)')
    expect(el.style.width).toBe('16px')
    expect(el.className).toContain('vl-spinner')
    expect(el.className).toContain('my-sp')
  })

  it('Skeleton merges style and className with library defaults', () => {
    render(
      <Skeleton
        data-testid="x"
        style={{ color: 'rgb(60, 60, 60)' }}
        className="my-sk"
      />,
    )
    const el = screen.getByTestId('x')
    expect(el.style.color).toBe('rgb(60, 60, 60)')
    expect(el.style.height).toBe('16px')
    expect(el.className).toContain('vl-skeleton')
    expect(el.className).toContain('my-sk')
  })

  it('Alert merges style and className with library defaults', () => {
    render(
      <Alert
        data-testid="x"
        style={{ background: 'rgb(70, 70, 70)' }}
        className="my-alert"
      >
        hi
      </Alert>,
    )
    const el = screen.getByTestId('x')
    expect(el.style.background).toBe('rgb(70, 70, 70)')
    expect(el.style.borderRadius).toBe('var(--r-md)')
    expect(el.className).toContain('vl-alert')
    expect(el.className).toContain('my-alert')
  })

  it('Dialog merges style and className on panel (incl. subparts)', () => {
    render(
      <Dialog
        open
        onOpenChange={() => {}}
        className="my-dialog"
        style={{ background: 'rgb(80, 80, 80)' }}
      >
        <Dialog.Header data-testid="dh" className="my-dh">H</Dialog.Header>
        <Dialog.Body data-testid="db" className="my-db">B</Dialog.Body>
        <Dialog.Footer data-testid="df" className="my-df">F</Dialog.Footer>
      </Dialog>,
    )
    const panel = document.querySelector('[data-vl-dialog]') as HTMLElement
    expect(panel.style.background).toBe('rgb(80, 80, 80)')
    expect(panel.style.borderRadius).toContain('var(--r-xl)')
    expect(panel.className).toContain('vl-dialog')
    expect(panel.className).toContain('my-dialog')
    expect(screen.getByTestId('dh').className).toContain('vl-dialog__header')
    expect(screen.getByTestId('db').className).toContain('vl-dialog__body')
    expect(screen.getByTestId('df').className).toContain('vl-dialog__footer')
  })
})
