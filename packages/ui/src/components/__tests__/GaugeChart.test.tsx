import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { GaugeChart } from '../..'

describe('GaugeChart', () => {
  it('renders hit-path overlay by default (showHoverTooltip defaults to true)', () => {
    const { container } = render(<GaugeChart value={50} max={100} />)
    const hit = container.querySelector('[data-vl-gauge-hit]')
    expect(hit).toBeTruthy()
  })

  it('does not render hit-path when showHoverTooltip={false}', () => {
    const { container } = render(
      <GaugeChart value={50} max={100} showHoverTooltip={false} />,
    )
    const hit = container.querySelector('[data-vl-gauge-hit]')
    expect(hit).toBeNull()
  })

  it('animated={false} renders value arc without stroke-dasharray transition', () => {
    const { container } = render(
      <GaugeChart value={75} max={100} animated={false} />,
    )
    // The value arc is the first <path> with stroke not transparent — easier: find by stroke-linecap round + stroke not transparent.
    const paths = Array.from(container.querySelectorAll('path')) as SVGPathElement[]
    const valuePath = paths.find(
      (p) => p.getAttribute('stroke-linecap') === 'round' && p.getAttribute('stroke') !== 'transparent',
    )
    expect(valuePath).toBeTruthy()
    // When animated=false the component clears inline transition / dasharray styles.
    expect(valuePath!.style.transition === '' || valuePath!.style.transition === undefined).toBe(true)
    expect(valuePath!.style.strokeDasharray === '' || valuePath!.style.strokeDasharray === undefined).toBe(true)
  })

  it('custom format is used in the hover tooltip output', () => {
    const fmt = (n: number) => `$${Math.round(n)}k`
    const { container } = render(<GaugeChart value={60} max={100} format={fmt} />)
    const hit = container.querySelector('[data-vl-gauge-hit]') as SVGPathElement
    expect(hit).toBeTruthy()
    // Tooltip now shows the CURRENT value (not an angle-projected one), driven by mouseenter.
    fireEvent.mouseEnter(hit)
    const tooltip = container.querySelector('[data-vl-gauge-tooltip]')
    expect(tooltip).toBeTruthy()
    expect(tooltip!.textContent).toContain('$60k')
    expect(tooltip!.textContent).toContain('60% of 100')
  })
})
