import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper } from '../Stepper'

const steps = [{ label: 'A' }, { label: 'B', description: 'desc' }, { label: 'C' }]

describe('Stepper', () => {
  it('renders all steps', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    expect(screen.getByText('desc')).toBeInTheDocument()
  })

  it('sets data-state=active on current step', () => {
    const { container } = render(<Stepper steps={steps} activeStep={1} />)
    const stepEls = container.querySelectorAll('[data-vl-stepper-step]')
    expect(stepEls[0].getAttribute('data-state')).toBe('complete')
    expect(stepEls[1].getAttribute('data-state')).toBe('active')
    expect(stepEls[2].getAttribute('data-state')).toBe('upcoming')
  })

  it('respects orientation', () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} orientation="vertical" />)
    expect(container.querySelector('[data-vl-stepper]')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('aria-current on active circle', () => {
    const { container } = render(<Stepper steps={steps} activeStep={1} />)
    const circles = container.querySelectorAll('[data-vl-stepper-circle]')
    expect(circles[1]).toHaveAttribute('aria-current', 'step')
  })
})
