import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleGroup } from '../ToggleGroup'

function Single({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState<string>('a')
  return (
    <ToggleGroup type="single" value={v} onValueChange={(x) => { setV(x); onChange?.(x) }}>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup>
  )
}

function Multi({ onChange }: { onChange?: (v: string[]) => void }) {
  const [v, setV] = useState<string[]>(['a'])
  return (
    <ToggleGroup type="multiple" value={v} onValueChange={(x) => { setV(x); onChange?.(x) }}>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    </ToggleGroup>
  )
}

describe('ToggleGroup', () => {
  it('renders items', () => {
    render(<Single />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('single: selects a value', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Single onChange={fn} />)
    await user.click(screen.getByText('B'))
    expect(fn).toHaveBeenCalledWith('b')
  })

  it('single: toggles off same value', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Single onChange={fn} />)
    await user.click(screen.getByText('A'))
    expect(fn).toHaveBeenCalledWith('')
  })

  it('multiple: adds value', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Multi onChange={fn} />)
    await user.click(screen.getByText('B'))
    expect(fn).toHaveBeenCalledWith(['a', 'b'])
  })

  it('multiple: removes value', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Multi onChange={fn} />)
    await user.click(screen.getByText('A'))
    expect(fn).toHaveBeenCalledWith([])
  })

  it('aria-pressed reflects state', () => {
    render(<Single />)
    expect(screen.getByText('A').closest('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('B').closest('button')).toHaveAttribute('aria-pressed', 'false')
  })
})
