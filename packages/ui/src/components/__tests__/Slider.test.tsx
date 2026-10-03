import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from '../Slider'

describe('Slider', () => {
  it('renders range input', () => {
    render(<Slider defaultValue={50} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('respects min/max/step', () => {
    render(<Slider min={0} max={200} step={5} defaultValue={100} />)
    const el = screen.getByRole('slider') as HTMLInputElement
    expect(el.min).toBe('0')
    expect(el.max).toBe('200')
    expect(el.step).toBe('5')
  })

  it('fires onValueChange with number', () => {
    const fn = vi.fn()
    render(<Slider defaultValue={50} onValueChange={fn} />)
    const el = screen.getByRole('slider')
    fireEvent.change(el, { target: { value: '70' } })
    expect(fn).toHaveBeenCalledWith(70)
  })

  it('disabled', () => {
    render(<Slider defaultValue={0} disabled />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('data-vl-slider on root', () => {
    render(<Slider defaultValue={0} />)
    expect(screen.getByRole('slider')).toHaveAttribute('data-vl-slider')
  })

  it('forwardRef', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Slider ref={ref} defaultValue={0} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
