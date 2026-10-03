import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LineChart, AreaChart, BarChart, SparklineChart, PieChart } from '../..'

const months = [
  { label: 'Jan', value: 24 },
  { label: 'Feb', value: 38 },
  { label: 'Mar', value: 31 },
  { label: 'Apr', value: 52 },
]

const slices = [
  { label: 'Pro', value: 38 },
  { label: 'Team', value: 27 },
  { label: 'Hobby', value: 20 },
  { label: 'Enterprise', value: 15 },
]

describe('LineChart', () => {
  it('renders an svg with data-vl-chart="line"', () => {
    const { container } = render(<LineChart data={months} />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('data-vl-chart')).toBe('line')
  })

  it('renders a <path> for the series', () => {
    const { container } = render(<LineChart data={months} />)
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('renders empty svg when data is empty', () => {
    const { container } = render(<LineChart data={[]} />)
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelectorAll('path').length).toBe(0)
  })

  it('respects width/height', () => {
    const { container } = render(<LineChart data={months} width={400} height={160} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('400')
    expect(svg.getAttribute('height')).toBe('160')
  })
})

describe('AreaChart', () => {
  it('renders an svg with data-vl-chart="area"', () => {
    const { container } = render(<AreaChart data={months} />)
    expect(container.querySelector('svg')!.getAttribute('data-vl-chart')).toBe('area')
  })

  it('renders a fill gradient (defs)', () => {
    const { container } = render(<AreaChart data={months} />)
    expect(container.querySelector('defs')).not.toBeNull()
  })
})

describe('BarChart', () => {
  it('renders an svg with data-vl-chart="bar"', () => {
    const { container } = render(<BarChart data={months} />)
    expect(container.querySelector('svg')!.getAttribute('data-vl-chart')).toBe('bar')
  })

  it('renders one bar per datum', () => {
    const { container } = render(<BarChart data={months} />)
    // Bars are rendered as <path> with rounded-top-rect geometry.
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(months.length)
  })

  it('shows value labels when showValues', () => {
    const { container } = render(<BarChart data={months} showValues />)
    const texts = Array.from(container.querySelectorAll('text')).map((t) => t.textContent)
    expect(texts).toContain('24')
    expect(texts).toContain('52')
  })
})

describe('SparklineChart', () => {
  it('renders an svg with data-vl-chart="sparkline"', () => {
    const { container } = render(<SparklineChart data={[1, 2, 3, 4, 5]} />)
    expect(container.querySelector('svg')!.getAttribute('data-vl-chart')).toBe('sparkline')
  })

  it('renders a path and optional end-dot', () => {
    const { container } = render(<SparklineChart data={[1, 2, 3]} showDot />)
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(0)
  })

  it('handles empty data without throwing', () => {
    const { container } = render(<SparklineChart data={[]} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})

describe('PieChart', () => {
  it('renders an svg with data-vl-chart="pie"', () => {
    const { container } = render(<PieChart data={slices} />)
    expect(container.querySelector('svg')!.getAttribute('data-vl-chart')).toBe('pie')
  })

  it('renders one slice path per datum (pie mode)', () => {
    const { container } = render(<PieChart data={slices} />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(slices.length)
  })

  it('renders arcs via stroke in donut mode and shows center labels', () => {
    const { container, getByText } = render(
      <PieChart data={slices} innerRadius={60} centerLabel="27%" centerSublabel="Team" />,
    )
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(slices.length)
    for (const p of Array.from(paths)) {
      expect(p.getAttribute('fill')).toBe('none')
      expect(p.getAttribute('stroke')).toBeTruthy()
    }
    expect(getByText('27%')).toBeInTheDocument()
    expect(getByText('Team')).toBeInTheDocument()
  })

  it('respects custom colors per datum', () => {
    const { container } = render(
      <PieChart
        data={[
          { label: 'A', value: 1, color: '#ff0000' },
          { label: 'B', value: 1, color: '#00ff00' },
        ]}
      />,
    )
    const fills = Array.from(container.querySelectorAll('path')).map((p) => p.getAttribute('fill'))
    expect(fills).toContain('#ff0000')
    expect(fills).toContain('#00ff00')
  })
})
