import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  ScatterChart,
  CandleChart,
  RadarChart,
  FunnelChart,
  WaterfallChart,
  TreemapChart,
  HeatmapChart,
  GaugeChart,
} from '../..'

const marker = (container: HTMLElement) =>
  container.querySelector('svg')!.getAttribute('data-vl-chart')

describe('ScatterChart', () => {
  it('renders with data-vl-chart="scatter" and one circle per point', () => {
    const { container } = render(
      <ScatterChart data={[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }]} />,
    )
    expect(marker(container)).toBe('scatter')
    expect(container.querySelectorAll('circle').length).toBeGreaterThanOrEqual(3)
  })

  it('empty data renders empty svg', () => {
    const { container } = render(<ScatterChart data={[]} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})

describe('CandleChart', () => {
  it('renders with data-vl-chart="candle"', () => {
    const { container } = render(
      <CandleChart
        data={[
          { label: 'A', open: 10, high: 14, low: 8, close: 12 },
          { label: 'B', open: 12, high: 15, low: 11, close: 11 },
        ]}
      />,
    )
    expect(marker(container)).toBe('candle')
    // body rects
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(2)
  })
})

describe('RadarChart', () => {
  it('renders with data-vl-chart="radar"', () => {
    const { container } = render(
      <RadarChart data={[{ axis: 'A', value: 10 }, { axis: 'B', value: 20 }, { axis: 'C', value: 15 }]} />,
    )
    expect(marker(container)).toBe('radar')
    expect(container.querySelectorAll('polygon').length).toBeGreaterThan(0)
  })
})

describe('FunnelChart', () => {
  it('renders with data-vl-chart="funnel" and one shape per stage', () => {
    const data = [
      { label: 'A', value: 100 },
      { label: 'B', value: 60 },
      { label: 'C', value: 20 },
    ]
    const { container } = render(<FunnelChart data={data} />)
    expect(marker(container)).toBe('funnel')
    expect(container.querySelectorAll('polygon,path').length).toBeGreaterThanOrEqual(data.length)
  })
})

describe('WaterfallChart', () => {
  it('renders with data-vl-chart="waterfall"', () => {
    const { container } = render(
      <WaterfallChart
        data={[
          { label: 'Start', value: 100, type: 'total' },
          { label: '+Sales', value: 40 },
          { label: '-Fees', value: -10 },
          { label: 'End', value: 0, type: 'total' },
        ]}
      />,
    )
    expect(marker(container)).toBe('waterfall')
  })
})

describe('TreemapChart', () => {
  it('renders with data-vl-chart="treemap" and one rect per datum', () => {
    const data = [
      { label: 'A', value: 50 },
      { label: 'B', value: 30 },
      { label: 'C', value: 20 },
    ]
    const { container } = render(<TreemapChart data={data} />)
    expect(marker(container)).toBe('treemap')
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(data.length)
  })
})

describe('HeatmapChart', () => {
  it('renders with data-vl-chart="heatmap"', () => {
    const { container } = render(
      <HeatmapChart
        data={[
          { x: 'A', y: 'Mon', value: 10 },
          { x: 'B', y: 'Mon', value: 50 },
          { x: 'A', y: 'Tue', value: 30 },
          { x: 'B', y: 'Tue', value: 70 },
        ]}
      />,
    )
    expect(marker(container)).toBe('heatmap')
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0)
  })
})

describe('GaugeChart', () => {
  it('renders with data-vl-chart="gauge" and shows label', () => {
    const { container, getByText } = render(<GaugeChart value={72} label="72%" sublabel="Score" />)
    expect(marker(container)).toBe('gauge')
    expect(getByText('72%')).toBeInTheDocument()
    expect(getByText('Score')).toBeInTheDocument()
  })

  it('clamps value above max to the arc endpoint without throwing', () => {
    const { container } = render(<GaugeChart value={200} max={100} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
