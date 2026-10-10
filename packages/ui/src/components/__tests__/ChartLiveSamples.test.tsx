/* eslint-disable @typescript-eslint/no-explicit-any */
// Smoke test: mount every chart component with the sample data wired for the
// docs' Live example section. Catches runtime crashes (bad data shape, missing
// required fields) before they ship to the browser.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  AreaChart, BarChart, LineChart, PieChart, ScatterChart, TreemapChart,
  CandleChart, RadarChart, FunnelChart, WaterfallChart, HeatmapChart,
  GaugeChart, SparklineChart,
  BeeswarmChart, BoxPlotChart, BulletChart, BumpChart, ChordChart,
  DendrogramChart, DumbbellChart, GanttChart, HistogramChart, HorizonChart,
  LollipopChart, MarimekkoChart, NetworkChart, NightingaleChart,
  ParallelCoordinatesChart, PopulationPyramidChart, RadialBarChart,
  RidgelineChart, SankeyChart, SlopeChart, StreamGraphChart, SunburstChart,
  TileMapChart, VennChart, ViolinChart, WaffleChart, WordCloudChart,
} from '../../index'

type Entry = { name: string; Component: React.ComponentType<any>; propsList: Record<string, unknown>[] }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const areaData = MONTHS.map((label, i) => ({ label, value: [42, 48, 45, 61, 58, 72, 69, 84, 91, 88, 104, 112][i] }))
const barMonthly = MONTHS.slice(0, 8).map((label, i) => ({ label, value: [34, 48, 42, 61, 52, 68, 74, 82][i] }))
const barSeries = { data: barMonthly, series: [{ label: 'iOS', data: [20, 28, 24, 36, 30, 40, 44, 48] }, { label: 'Android', data: [14, 20, 18, 25, 22, 28, 30, 34] }] }
const lineData = MONTHS.map((label, i) => ({ label, value: [12, 14, 20, 22, 28, 34, 42, 44, 50, 58, 62, 72][i] }))
const scatterPoints = Array.from({ length: 36 }, (_, i) => ({ x: 10 + (i % 12) * 7, y: 20 + Math.sin(i * 0.6) * 18 + ((i * 7) % 23) }))
const pieData = [{ label: 'Email', value: 38 }, { label: 'Search', value: 26 }, { label: 'Social', value: 18 }, { label: 'Direct', value: 12 }]
const treemapData = [{ label: 'Eng', value: 42 }, { label: 'Design', value: 18 }, { label: 'Sales', value: 12 }]
const candleData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, i) => ({ label, open: 100, close: 102 + i, high: 108 + i, low: 95 + i }))
const radarData = ['Speed', 'Reliability', 'Comfort', 'Safety'].map((label, i) => ({ label, value: [78, 92, 64, 88][i] }))
const funnelData = [{ label: 'Visited', value: 10000 }, { label: 'Signed up', value: 4200 }, { label: 'Paid', value: 980 }]
const waterfallData = [
  { label: 'Start', value: 120, type: 'total' as const },
  { label: 'Q1', value: 32 }, { label: 'Q2', value: -14 },
  { label: 'End', value: 138, type: 'total' as const },
]
const heatmapData = Array.from({ length: 3 }, (_, y) => Array.from({ length: 4 }, (_, x) => ({ x: `C${x}`, y: `R${y}`, value: (x + 1) * (y + 1) * 5 }))).flat()
const sparkData = [12, 14, 11, 18, 22, 19, 28, 24, 32, 30]

const CASES: Entry[] = [
  { name: 'AreaChart', Component: AreaChart, propsList: [{ data: areaData }, { data: areaData, smooth: false }, { data: areaData, series: [{ label: 'A', data: [1,2,3,4,5,6,7,8,9,10,11,12] }, { label: 'B', data: [2,3,4,5,6,7,8,9,10,11,12,13] }], stack: true }] },
  { name: 'BarChart', Component: BarChart, propsList: [{ data: barMonthly }, { data: barMonthly, horizontal: true }, { ...barSeries }, { ...barSeries, stack: 'stacked' }, { ...barSeries, stack: 'percent' }] },
  { name: 'LineChart', Component: LineChart, propsList: [{ data: lineData }, { data: lineData, curve: 'spline' }, { data: lineData, curve: 'step' }] },
  { name: 'ScatterChart', Component: ScatterChart, propsList: [{ data: scatterPoints }, { data: scatterPoints, connected: true }] },
  { name: 'PieChart', Component: PieChart, propsList: [{ data: pieData }, { data: pieData, innerRadius: 60 }, { data: pieData, showLabels: true }] },
  { name: 'TreemapChart', Component: TreemapChart, propsList: [{ data: treemapData }] },
  { name: 'CandleChart', Component: CandleChart, propsList: [{ data: candleData }, { data: candleData, type: 'ohlc' }] },
  { name: 'RadarChart', Component: RadarChart, propsList: [{ data: radarData }, { data: radarData, series: [{ label: 'A', data: [78, 92, 64, 88] }, { label: 'B', data: [66, 84, 82, 90] }] }] },
  { name: 'FunnelChart', Component: FunnelChart, propsList: [{ data: funnelData }] },
  { name: 'WaterfallChart', Component: WaterfallChart, propsList: [{ data: waterfallData }] },
  { name: 'HeatmapChart', Component: HeatmapChart, propsList: [{ data: heatmapData }] },
  { name: 'GaugeChart', Component: GaugeChart, propsList: [{ value: 72, max: 100 }, { value: 72, max: 100, thresholds: [{ at: 40 }, { at: 70 }] }] },
  { name: 'SparklineChart', Component: SparklineChart, propsList: [{ data: sparkData }, { data: sparkData, type: 'bar' }] },
  { name: 'BulletChart', Component: BulletChart, propsList: [{ data: [{ label: 'A', value: 82, target: 90, ranges: [40, 70, 100] }] }] },
  { name: 'LollipopChart', Component: LollipopChart, propsList: [{ data: [{ label: 'A', value: 42 }, { label: 'B', value: 18 }] }, { data: [{ label: 'A', value: 42 }, { label: 'B', value: 18 }], orientation: 'vertical' }] },
  { name: 'DumbbellChart', Component: DumbbellChart, propsList: [{ data: [{ label: 'FR', start: 62, end: 78 }, { label: 'DE', start: 54, end: 72 }] }] },
  { name: 'SlopeChart', Component: SlopeChart, propsList: [{ data: [{ label: 'Chrome', start: 65, end: 71 }, { label: 'Safari', start: 18, end: 20 }] }] },
  { name: 'RadialBarChart', Component: RadialBarChart, propsList: [{ data: [{ label: 'Mobile', value: 72 }, { label: 'Desktop', value: 54 }], max: 100 }] },
  { name: 'ParallelCoordinatesChart', Component: ParallelCoordinatesChart, propsList: [{ dimensions: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }], data: [{ a: 1, b: 2 }, { a: 3, b: 4 }] }] },
  { name: 'SunburstChart', Component: SunburstChart, propsList: [{ data: { name: 'root', children: [{ name: 'A', value: 10 }, { name: 'B', value: 20 }] } }] },
  { name: 'DendrogramChart', Component: DendrogramChart, propsList: [{ data: { name: 'root', children: [{ name: 'A', children: [{ name: 'A1' }] }, { name: 'B' }] } }] },
  { name: 'VennChart', Component: VennChart, propsList: [{ sets: [{ label: 'A', size: 60 }, { label: 'B', size: 50 }, { label: 'C', size: 40 }] }, { sets: [{ label: 'A', size: 60 }, { label: 'B', size: 50 }] }] },
  { name: 'WaffleChart', Component: WaffleChart, propsList: [{ data: [{ label: 'A', value: 42 }, { label: 'B', value: 24 }, { label: 'C', value: 34 }] }] },
  { name: 'MarimekkoChart', Component: MarimekkoChart, propsList: [{ columns: [{ label: 'NA', segments: [{ label: 'Pro', value: 28 }, { label: 'Free', value: 10 }] }, { label: 'EU', segments: [{ label: 'Pro', value: 22 }, { label: 'Free', value: 12 }] }] }] },
  { name: 'NightingaleChart', Component: NightingaleChart, propsList: [{ data: MONTHS.map((label, i) => ({ label, value: 20 + i * 4 })) }] },
  { name: 'HistogramChart', Component: HistogramChart, propsList: [{ values: Array.from({ length: 60 }, (_, i) => i + Math.sin(i)), bins: 8 }] },
  { name: 'BoxPlotChart', Component: BoxPlotChart, propsList: [{ data: [{ label: 'A', values: [1,2,3,4,5,6,7,8,9,10] }, { label: 'B', values: [5,6,7,8,9,10,11,12,13] }] }] },
  { name: 'ViolinChart', Component: ViolinChart, propsList: [{ data: [{ label: 'A', values: Array.from({ length: 30 }, (_, i) => 20 + Math.sin(i)) }] }] },
  { name: 'RidgelineChart', Component: RidgelineChart, propsList: [{ data: [{ label: 'A', values: Array.from({ length: 20 }, (_, i) => Math.sin(i) + 10) }, { label: 'B', values: Array.from({ length: 20 }, (_, i) => Math.cos(i) + 10) }] }] },
  { name: 'BeeswarmChart', Component: BeeswarmChart, propsList: [{ data: Array.from({ length: 20 }, (_, i) => ({ value: 20 + i })) }] },
  { name: 'PopulationPyramidChart', Component: PopulationPyramidChart, propsList: [{ data: [{ group: '0–9', left: 320, right: 305 }, { group: '10–19', left: 360, right: 340 }] }] },
  { name: 'StreamGraphChart', Component: StreamGraphChart, propsList: [{ series: [{ label: 'A', data: [1,2,3,4,5] }, { label: 'B', data: [2,3,2,3,2] }] }] },
  { name: 'BumpChart', Component: BumpChart, propsList: [{ periods: ['Q1','Q2','Q3'], series: [{ label: 'A', data: [1,2,1] }, { label: 'B', data: [2,1,2] }] }] },
  { name: 'GanttChart', Component: GanttChart, propsList: [{ tasks: [{ label: 'A', start: 0, end: 5 }, { label: 'B', start: 3, end: 10 }] }] },
  { name: 'HorizonChart', Component: HorizonChart, propsList: [{ series: [{ label: 'A', data: [1,2,3,4,5] }, { label: 'B', data: [2,3,2,3,2] }] }] },
  { name: 'SankeyChart', Component: SankeyChart, propsList: [{ nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }], links: [{ source: 'a', target: 'b', value: 5 }, { source: 'b', target: 'c', value: 3 }] }] },
  { name: 'ChordChart', Component: ChordChart, propsList: [{ labels: ['A','B','C'], matrix: [[0,2,1],[2,0,3],[1,3,0]] }] },
  { name: 'NetworkChart', Component: NetworkChart, propsList: [{ nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }], links: [{ source: 'a', target: 'b' }, { source: 'b', target: 'c' }] }] },
  { name: 'TileMapChart', Component: TileMapChart, propsList: [{ data: [{ id: 'wa', label: 'WA', value: 42, row: 0, col: 0 }, { id: 'or', label: 'OR', value: 38, row: 1, col: 0 }] }] },
  { name: 'WordCloudChart', Component: WordCloudChart, propsList: [{ words: [{ text: 'React', value: 100 }, { text: 'TypeScript', value: 80 }, { text: 'SVG', value: 50 }] }] },
]

describe('Chart live sample smoke tests', () => {
  for (const c of CASES) {
    for (let i = 0; i < c.propsList.length; i++) {
      it(`${c.name} renders variant ${i} without crashing`, () => {
        const { container } = render(<c.Component {...c.propsList[i]} />)
        expect(container.querySelector('svg')).toBeTruthy()
      })
    }
  }

  it('all 40 chart types are covered', () => {
    expect(CASES).toHaveLength(40)
  })

  it('also handles empty data gracefully', () => {
    // Each component should render an empty <svg/> placeholder, not throw.
    const emptyProps: [React.ComponentType<any>, Record<string, unknown>][] = [
      [AreaChart, { data: [] }],
      [BarChart, { data: [] }],
      [LineChart, { data: [] }],
      [PieChart, { data: [] }],
      [TreemapChart, { data: [] }],
      [HeatmapChart, { data: [] }],
      [SankeyChart, { nodes: [], links: [] }],
      [NetworkChart, { nodes: [], links: [] }],
      [GanttChart, { tasks: [] }],
      [StreamGraphChart, { series: [] }],
      [HistogramChart, { values: [] }],
    ]
    for (const [Component, props] of emptyProps) {
      const { container, unmount } = render(<Component {...props} />)
      expect(container.querySelector('svg')).toBeTruthy()
      unmount()
    }
  })
})
