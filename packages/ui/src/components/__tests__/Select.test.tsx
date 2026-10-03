import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '../Select'

const opts = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={opts} />)
    const sel = screen.getByRole('combobox') as HTMLSelectElement
    expect(sel.options.length).toBe(3)
  })

  it('placeholder renders disabled option', () => {
    render(<Select options={opts} placeholder="Pick" />)
    const sel = screen.getByRole('combobox') as HTMLSelectElement
    expect(sel.options[0].text).toBe('Pick')
    expect(sel.options[0].disabled).toBe(true)
  })

  it('fires onValueChange', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Select options={opts} onValueChange={fn} defaultValue="a" />)
    await user.selectOptions(screen.getByRole('combobox'), 'b')
    expect(fn).toHaveBeenCalledWith('b')
  })

  it('size reflected', () => {
    render(<Select options={opts} size="sm" />)
    expect(screen.getByRole('combobox').closest('[data-vl-select]')).toHaveAttribute('data-size', 'sm')
  })

  it('invalid reflected', () => {
    render(<Select options={opts} invalid />)
    const sel = screen.getByRole('combobox')
    expect(sel).toHaveAttribute('aria-invalid', 'true')
    expect(sel.closest('[data-vl-select]')).toHaveAttribute('data-invalid', '')
  })

  it('disabled', () => {
    render(<Select options={opts} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('forwardRef', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} options={opts} />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })
})
