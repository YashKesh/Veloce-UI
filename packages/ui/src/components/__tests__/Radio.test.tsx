import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio, RadioGroup } from '../Radio'

function Controlled({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState('a')
  return (
    <RadioGroup value={v} onValueChange={(x) => { setV(x); onChange?.(x) }} name="g">
      <Radio value="a" label="A" />
      <Radio value="b" label="B" />
      <Radio value="c" label="C" />
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  it('renders group of radios', () => {
    render(<Controlled />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  it('selects by click', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Controlled onChange={fn} />)
    await user.click(screen.getByText('B'))
    expect(fn).toHaveBeenCalledWith('b')
  })

  it('reflects checked via data attribute', () => {
    render(<Controlled />)
    const labelA = screen.getByText('A').closest('[data-vl-radio]')
    expect(labelA).toHaveAttribute('data-checked')
  })

  it('arrow keys navigate', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    inputs[0].focus()
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(inputs[1])
  })

  it('passes name to inputs', () => {
    render(<Controlled />)
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    inputs.forEach((i) => expect(i.name).toBe('g'))
  })
})
