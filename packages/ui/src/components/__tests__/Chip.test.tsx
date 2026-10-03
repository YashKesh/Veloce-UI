import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip, type ChipTone, type ChipVariant } from '../Chip'

describe('Chip', () => {
  it('renders children', () => {
    render(<Chip>Tag</Chip>)
    expect(screen.getByText('Tag')).toBeInTheDocument()
  })

  it('applies distinct colors per tone', () => {
    const tones: ChipTone[] = ['neutral', 'accent', 'ok', 'warn', 'err']
    const bgs = new Set<string>()
    for (const t of tones) {
      const { container, unmount } = render(
        <Chip tone={t} variant="solid">
          x
        </Chip>,
      )
      const span = container.querySelector('span') as HTMLElement
      bgs.add(span.style.background)
      unmount()
    }
    expect(bgs.size).toBe(tones.length)
  })

  it('applies distinct styles per variant', () => {
    const variants: ChipVariant[] = ['solid', 'soft', 'outline']
    const seen = new Set<string>()
    for (const v of variants) {
      const { container, unmount } = render(
        <Chip tone="accent" variant={v}>
          x
        </Chip>,
      )
      const span = container.querySelector('span') as HTMLElement
      seen.add(`${span.style.background}|${span.style.border}`)
      unmount()
    }
    expect(seen.size).toBe(variants.length)
  })

  it('onRemove renders ✕ button and fires callback on click', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Tag</Chip>)
    const btn = screen.getByRole('button', { name: 'Remove' })
    expect(btn).toHaveTextContent('✕')
    await user.click(btn)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('keyboard Enter on ✕ fires onRemove', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Tag</Chip>)
    const btn = screen.getByRole('button', { name: 'Remove' })
    btn.focus()
    await user.keyboard('{Enter}')
    expect(onRemove).toHaveBeenCalled()
  })

  it('root chip click still fires its own onClick independent of remove button', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <Chip onClick={onClick} onRemove={onRemove} data-testid="chip">
        Tag
      </Chip>,
    )
    // click chip body (the text node's parent)
    await user.click(screen.getByText('Tag'))
    expect(onClick).toHaveBeenCalled()
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('sets data-vl-chip on root', () => {
    const { container } = render(<Chip>Tag</Chip>)
    expect(container.querySelector('[data-vl-chip]')).not.toBeNull()
  })

  it('does not render ✕ when onRemove is not provided', () => {
    render(<Chip>Tag</Chip>)
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
  })

  it('survives global span/button reset (inline style reads CSS variable)', () => {
    const style = document.createElement('style')
    style.textContent =
      'span, button { background: none !important; border: none !important; color: inherit !important; }'
    document.head.appendChild(style)

    render(<Chip data-testid="chip" variant="soft">Hi</Chip>)
    const chip = screen.getByTestId('chip')
    expect(chip.style.background).toContain('var(--vl-chip-bg')

    document.head.removeChild(style)
  })
})
