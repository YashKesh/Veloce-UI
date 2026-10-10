/* eslint-disable @typescript-eslint/no-explicit-any */
// Live example wiring for chart doc pages. Mounts the real chart component with
// representative data so users can see the component respond to theme changes
// and prop variants. Merged into CHART_PAGES by chartsAll.ts.

import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  TreemapChart,
  CandleChart,
  RadarChart,
  FunnelChart,
  WaterfallChart,
  HeatmapChart,
  GaugeChart,
  SparklineChart,
  BeeswarmChart,
  BoxPlotChart,
  BulletChart,
  BumpChart,
  ChordChart,
  DendrogramChart,
  DumbbellChart,
  GanttChart,
  HistogramChart,
  HorizonChart,
  LollipopChart,
  MarimekkoChart,
  NetworkChart,
  NightingaleChart,
  ParallelCoordinatesChart,
  PopulationPyramidChart,
  RadialBarChart,
  RidgelineChart,
  SankeyChart,
  SlopeChart,
  StreamGraphChart,
  SunburstChart,
  TileMapChart,
  VennChart,
  ViolinChart,
  WaffleChart,
  WordCloudChart,
} from 'veloce-ui'
import type { LiveSample } from './chartsData'

type Entry = { Component: React.ComponentType<any>; sample: LiveSample }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const areaData = MONTHS.map((label, i) => ({ label, value: [42, 48, 45, 61, 58, 72, 69, 84, 91, 88, 104, 112][i] }))
const areaStacked = {
  data: areaData,
  series: [
    { label: 'Direct', data: [20, 24, 22, 30, 28, 36, 34, 42, 46, 44, 52, 56] },
    { label: 'Referral', data: [12, 14, 15, 18, 17, 22, 21, 26, 28, 27, 32, 34] },
    { label: 'Organic', data: [10, 10, 8, 13, 13, 14, 14, 16, 17, 17, 20, 22] },
  ],
}

const barMonthly = MONTHS.slice(0, 8).map((label, i) => ({
  label,
  value: [34, 48, 42, 61, 52, 68, 74, 82][i],
}))
const barGrouped = {
  data: barMonthly,
  series: [
    { label: 'iOS', data: [20, 28, 24, 36, 30, 40, 44, 48] },
    { label: 'Android', data: [14, 20, 18, 25, 22, 28, 30, 34] },
  ],
}

const lineData = MONTHS.map((label, i) => ({ label, value: [12, 14, 20, 22, 28, 34, 42, 44, 50, 58, 62, 72][i] }))
const lineMulti = {
  data: lineData,
  series: [
    { label: 'Users', data: [12, 14, 20, 22, 28, 34, 42, 44, 50, 58, 62, 72] },
    { label: 'Sessions', data: [20, 24, 28, 34, 42, 48, 55, 60, 68, 76, 82, 92] },
  ],
}

const scatterPoints = Array.from({ length: 36 }, (_, i) => {
  const x = 10 + (i % 12) * 7 + (i * 13) % 9
  const y = 20 + Math.sin(i * 0.6) * 18 + ((i * 7) % 23)
  return { x, y }
})

const pieData = [
  { label: 'Email', value: 38 },
  { label: 'Search', value: 26 },
  { label: 'Social', value: 18 },
  { label: 'Direct', value: 12 },
  { label: 'Referral', value: 6 },
]

const treemapData = [
  { label: 'Engineering', value: 42 },
  { label: 'Design', value: 18 },
  { label: 'Marketing', value: 14 },
  { label: 'Sales', value: 12 },
  { label: 'Support', value: 8 },
  { label: 'Ops', value: 6 },
]

const candleData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, i) => {
  const base = 100 + i * 2 + Math.sin(i) * 4
  const open = base + ((i * 7) % 5) - 2
  const close = base + Math.cos(i * 1.3) * 3 + (i % 2 ? 1.5 : -1.5)
  const high = Math.max(open, close) + 2 + (i % 3)
  const low = Math.min(open, close) - 2 - ((i + 1) % 3)
  return { label, open, high, low, close }
})

const radarAxes = ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Range']
const radarData = radarAxes.map((label, i) => ({ label, value: [78, 92, 64, 88, 72, 80][i] }))
const radarMulti = {
  data: radarData,
  series: [
    { label: 'Model S', data: [78, 92, 64, 88, 72, 80] },
    { label: 'Model X', data: [66, 84, 82, 90, 68, 74] },
  ],
}

const funnelData = [
  { label: 'Visited', value: 10000 },
  { label: 'Signed up', value: 4200 },
  { label: 'Activated', value: 2600 },
  { label: 'Paid', value: 980 },
  { label: 'Retained', value: 640 },
]

const waterfallData = [
  { label: 'Start', value: 120, type: 'total' as const },
  { label: 'Q1', value: 32 },
  { label: 'Q2', value: -14 },
  { label: 'Q3', value: 22 },
  { label: 'Q4', value: -8 },
  { label: 'End', value: 152, type: 'total' as const },
]

const heatmapData = Array.from({ length: 7 }, (_, y) =>
  Array.from({ length: 12 }, (_, x) => ({
    x: MONTHS[x],
    y: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][y],
    value: Math.round(10 + 60 * Math.abs(Math.sin((x + 1) * (y + 1) * 0.4))),
  })),
).flat()

const sparkData = [12, 14, 11, 18, 22, 19, 28, 24, 32, 30, 38, 42, 40, 48, 54]

export const LIVE_SAMPLES: Record<string, Entry> = {
  area: {
    Component: AreaChart,
    sample: {
      props: { data: areaData, height: 280 },
      variants: [
        { label: 'Smooth', props: { data: areaData, smooth: true, height: 280 } },
        { label: 'Linear', props: { data: areaData, smooth: false, height: 280 } },
        { label: 'Stacked', props: { ...areaStacked, stack: true, height: 280 } },
      ],
    },
  },
  bar: {
    Component: BarChart,
    sample: {
      props: { data: barMonthly, height: 280 },
      variants: [
        { label: 'Vertical', props: { data: barMonthly, height: 280 } },
        { label: 'Horizontal', props: { data: barMonthly, horizontal: true, height: 320 } },
        { label: 'Grouped', props: { ...barGrouped, height: 280 } },
        { label: 'Stacked', props: { ...barGrouped, stack: 'stacked', height: 280 } },
      ],
    },
  },
  line: {
    Component: LineChart,
    sample: {
      props: { data: lineData, height: 280 },
      variants: [
        { label: 'Linear', props: { data: lineData, curve: 'linear', height: 280 } },
        { label: 'Spline', props: { data: lineData, curve: 'spline', height: 280 } },
        { label: 'Step', props: { data: lineData, curve: 'step', height: 280 } },
        { label: 'Multi-series', props: { ...lineMulti, height: 280 } },
      ],
    },
  },
  scatter: {
    Component: ScatterChart,
    sample: {
      props: { data: scatterPoints, height: 300, showGrid: true },
      variants: [
        { label: 'Points', props: { data: scatterPoints, height: 300, showGrid: true } },
        { label: 'Connected', props: { data: scatterPoints, height: 300, connected: true, showGrid: true } },
      ],
    },
  },
  'pie-donut': {
    Component: PieChart,
    sample: {
      props: { data: pieData, size: 260 },
      variants: [
        { label: 'Pie', props: { data: pieData, size: 260 } },
        { label: 'Donut', props: { data: pieData, size: 260, innerRadius: 70, centerLabel: '100', centerSublabel: 'visits' } },
        { label: 'With labels', props: { data: pieData, size: 260, showLabels: true } },
      ],
    },
  },
  treemap: {
    Component: TreemapChart,
    sample: {
      props: { data: treemapData, width: 560, height: 300 },
    },
  },
  candle: {
    Component: CandleChart,
    sample: {
      props: { data: candleData, height: 300 },
      variants: [
        { label: 'Candle', props: { data: candleData, height: 300, type: 'candle' } },
        { label: 'OHLC', props: { data: candleData, height: 300, type: 'ohlc' } },
      ],
    },
  },
  radar: {
    Component: RadarChart,
    sample: {
      props: { data: radarData, size: 280 },
      variants: [
        { label: 'Single', props: { data: radarData, size: 280 } },
        { label: 'Multi-series', props: { ...radarMulti, size: 280 } },
      ],
    },
  },
  funnel: {
    Component: FunnelChart,
    sample: { props: { data: funnelData, width: 520, height: 300 } },
  },
  waterfall: {
    Component: WaterfallChart,
    sample: {
      props: { data: waterfallData, height: 300, showValues: true },
      variants: [
        { label: 'With values', props: { data: waterfallData, height: 300, showValues: true } },
        { label: 'Without values', props: { data: waterfallData, height: 300, showValues: false } },
      ],
    },
  },
  heatmap: {
    Component: HeatmapChart,
    sample: { props: { data: heatmapData, width: 560, height: 280 } },
  },
  gauge: {
    Component: GaugeChart,
    sample: {
      props: { value: 72, max: 100, size: 240, label: '72%', sublabel: 'uptime' },
      variants: [
        { label: 'No thresholds', props: { value: 72, max: 100, size: 240, label: '72%', sublabel: 'uptime', thresholds: [] } },
        { label: 'Custom thresholds', props: { value: 72, max: 100, size: 240, label: '72%', sublabel: 'uptime', thresholds: [{ at: 40, label: 'low' }, { at: 70, label: 'high' }] } },
      ],
    },
  },
  sparkline: {
    Component: SparklineChart,
    sample: {
      props: { data: sparkData, width: 320, height: 60, endMarker: true },
      height: 120,
      variants: [
        { label: 'Line', props: { data: sparkData, type: 'line', width: 320, height: 60, endMarker: true } },
        { label: 'Bar', props: { data: sparkData, type: 'bar', width: 320, height: 60 } },
        {
          label: 'Status',
          props: {
            data: [8, 10, -2, 4, -6, 12, 14, -1, 6, 9, -3, 7, 11, -5, 8],
            type: 'status',
            width: 320,
            height: 24,
            baseline: 0,
          },
        },
        {
          label: 'With baseline',
          props: { data: [12, 14, 11, 18, 22, 19, 28, 24, 32, 30, 26, 22, 18, 24, 32], type: 'bar', width: 320, height: 60, baseline: 22 },
        },
      ],
    },
  },

  // ── Comparison ──────────────────────────────────────────────────────────
  bullet: {
    Component: BulletChart,
    sample: {
      props: {
        width: 520,
        height: 200,
        data: [
          { label: 'Revenue', value: 82, target: 90, ranges: [40, 70, 100] },
          { label: 'Signups', value: 55, target: 60, ranges: [30, 55, 80] },
          { label: 'NPS', value: 42, target: 50, ranges: [20, 40, 60] },
        ],
      },
    },
  },
  lollipop: {
    Component: LollipopChart,
    sample: {
      props: {
        data: [
          { label: 'Engineering', value: 42 },
          { label: 'Design', value: 24 },
          { label: 'Marketing', value: 18 },
          { label: 'Sales', value: 14 },
          { label: 'Support', value: 10 },
          { label: 'Ops', value: 6 },
        ],
        width: 500,
        height: 280,
      },
      variants: [
        { label: 'Horizontal', props: { orientation: 'horizontal', width: 500, height: 280, data: [
          { label: 'Engineering', value: 42 }, { label: 'Design', value: 24 }, { label: 'Marketing', value: 18 },
          { label: 'Sales', value: 14 }, { label: 'Support', value: 10 }, { label: 'Ops', value: 6 },
        ] } },
        { label: 'Vertical', props: { orientation: 'vertical', width: 500, height: 280, data: [
          { label: 'Jan', value: 42 }, { label: 'Feb', value: 24 }, { label: 'Mar', value: 18 },
          { label: 'Apr', value: 14 }, { label: 'May', value: 10 }, { label: 'Jun', value: 32 },
        ] } },
      ],
    },
  },
  dumbbell: {
    Component: DumbbellChart,
    sample: {
      props: {
        data: [
          { label: 'France', start: 62, end: 78 },
          { label: 'Germany', start: 54, end: 72 },
          { label: 'Spain', start: 48, end: 70 },
          { label: 'Italy', start: 44, end: 66 },
          { label: 'Poland', start: 36, end: 60 },
        ],
        startLabel: '2020',
        endLabel: '2025',
        width: 540,
        height: 280,
      },
    },
  },
  slope: {
    Component: SlopeChart,
    sample: {
      props: {
        data: [
          { label: 'Chrome', start: 65, end: 71 },
          { label: 'Safari', start: 18, end: 20 },
          { label: 'Firefox', start: 10, end: 5 },
          { label: 'Edge', start: 5, end: 3 },
          { label: 'Other', start: 2, end: 1 },
        ],
        leftLabel: '2023',
        rightLabel: '2025',
        width: 520,
        height: 300,
      },
    },
  },
  'radial-bar': {
    Component: RadialBarChart,
    sample: {
      props: {
        data: [
          { label: 'Mobile', value: 72 },
          { label: 'Desktop', value: 54 },
          { label: 'Tablet', value: 38 },
          { label: 'TV', value: 18 },
        ],
        max: 100,
        size: 280,
      },
    },
  },
  'parallel-coordinates': {
    Component: ParallelCoordinatesChart,
    sample: {
      props: {
        dimensions: [
          { key: 'mpg', label: 'MPG', min: 10, max: 50 },
          { key: 'hp', label: 'HP', min: 60, max: 250 },
          { key: 'weight', label: 'Weight', min: 1500, max: 4500 },
          { key: 'accel', label: '0–60s', min: 6, max: 20 },
        ],
        data: [
          { mpg: 24, hp: 110, weight: 2800, accel: 11 },
          { mpg: 36, hp: 85, weight: 2300, accel: 14 },
          { mpg: 18, hp: 210, weight: 3900, accel: 7 },
          { mpg: 28, hp: 140, weight: 3100, accel: 9 },
          { mpg: 42, hp: 70, weight: 2100, accel: 16 },
          { mpg: 15, hp: 240, weight: 4200, accel: 6.5 },
        ],
        colorKey: 'hp',
        width: 540,
        height: 300,
      },
    },
  },

  // ── Hierarchy / part-to-whole ───────────────────────────────────────────
  sunburst: {
    Component: SunburstChart,
    sample: {
      props: {
        size: 320,
        data: {
          name: 'root',
          children: [
            { name: 'Engineering', children: [
              { name: 'Frontend', value: 24 }, { name: 'Backend', value: 18 }, { name: 'DevOps', value: 10 },
            ] },
            { name: 'Design', children: [
              { name: 'Product', value: 14 }, { name: 'Brand', value: 8 },
            ] },
            { name: 'Marketing', children: [
              { name: 'Growth', value: 10 }, { name: 'Content', value: 6 },
            ] },
            { name: 'Sales', value: 16 },
          ],
        },
      },
    },
  },
  dendrogram: {
    Component: DendrogramChart,
    sample: {
      props: {
        width: 540,
        height: 320,
        data: {
          name: 'Life',
          children: [
            { name: 'Animals', children: [
              { name: 'Mammals', children: [{ name: 'Primates' }, { name: 'Rodents' }] },
              { name: 'Birds', children: [{ name: 'Raptors' }, { name: 'Songbirds' }] },
            ] },
            { name: 'Plants', children: [
              { name: 'Trees' }, { name: 'Grasses' }, { name: 'Flowers' },
            ] },
            { name: 'Fungi', children: [{ name: 'Mushrooms' }, { name: 'Molds' }] },
          ],
        },
      },
    },
  },
  venn: {
    Component: VennChart,
    sample: {
      props: {
        width: 460,
        height: 300,
        sets: [
          { label: 'React', size: 62 },
          { label: 'TypeScript', size: 54 },
          { label: 'Accessible', size: 42 },
        ],
      },
    },
  },
  waffle: {
    Component: WaffleChart,
    sample: {
      props: {
        rows: 10,
        cols: 10,
        size: 300,
        data: [
          { label: 'Shipped', value: 42 },
          { label: 'In review', value: 24 },
          { label: 'Blocked', value: 12 },
          { label: 'Planned', value: 22 },
        ],
      },
    },
  },
  marimekko: {
    Component: MarimekkoChart,
    sample: {
      props: {
        width: 540,
        height: 300,
        columns: [
          { label: 'NA', segments: [
            { label: 'Pro', value: 28 }, { label: 'Team', value: 16 }, { label: 'Free', value: 10 },
          ] },
          { label: 'EU', segments: [
            { label: 'Pro', value: 22 }, { label: 'Team', value: 14 }, { label: 'Free', value: 12 },
          ] },
          { label: 'APAC', segments: [
            { label: 'Pro', value: 14 }, { label: 'Team', value: 12 }, { label: 'Free', value: 18 },
          ] },
          { label: 'LATAM', segments: [
            { label: 'Pro', value: 8 }, { label: 'Team', value: 6 }, { label: 'Free', value: 10 },
          ] },
        ],
      },
    },
  },
  nightingale: {
    Component: NightingaleChart,
    sample: {
      props: {
        size: 300,
        data: [
          { label: 'Jan', value: 32 }, { label: 'Feb', value: 42 }, { label: 'Mar', value: 56 },
          { label: 'Apr', value: 48 }, { label: 'May', value: 64 }, { label: 'Jun', value: 72 },
          { label: 'Jul', value: 68 }, { label: 'Aug', value: 54 }, { label: 'Sep', value: 60 },
          { label: 'Oct', value: 46 }, { label: 'Nov', value: 38 }, { label: 'Dec', value: 44 },
        ],
      },
    },
  },

  // ── Distribution ────────────────────────────────────────────────────────
  histogram: {
    Component: HistogramChart,
    sample: {
      props: {
        values: Array.from({ length: 300 }, () => {
          // bell-ish distribution 0..100
          const u1 = Math.random(), u2 = Math.random()
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
          return Math.max(0, Math.min(100, 50 + z * 15))
        }),
        bins: 14,
        width: 520,
        height: 300,
      },
    },
  },
  'box-plot': {
    Component: BoxPlotChart,
    sample: {
      props: {
        width: 520,
        height: 300,
        data: [
          { label: 'A', values: [12, 14, 15, 17, 18, 20, 21, 22, 24, 26, 28, 31, 34] },
          { label: 'B', values: [18, 20, 22, 23, 24, 25, 27, 28, 30, 32, 36, 42] },
          { label: 'C', values: [8, 9, 10, 12, 14, 16, 17, 18, 20, 22, 25, 28] },
          { label: 'D', values: [22, 24, 26, 28, 30, 32, 34, 36, 40, 44, 48, 54] },
        ],
      },
    },
  },
  violin: {
    Component: ViolinChart,
    sample: {
      props: {
        width: 520,
        height: 300,
        data: [
          { label: 'Alpha', values: Array.from({ length: 80 }, (_, i) => 40 + Math.sin(i * 0.4) * 12 + (i % 7)) },
          { label: 'Beta', values: Array.from({ length: 80 }, (_, i) => 55 + Math.cos(i * 0.6) * 8 + (i % 5)) },
          { label: 'Gamma', values: Array.from({ length: 80 }, (_, i) => 30 + Math.sin(i * 0.3) * 20 + (i % 11)) },
        ],
      },
    },
  },
  ridgeline: {
    Component: RidgelineChart,
    sample: {
      props: {
        width: 540,
        height: 320,
        data: ['2019', '2020', '2021', '2022', '2023'].map((label, s) => ({
          label,
          values: Array.from({ length: 40 }, (_, i) =>
            30 + Math.sin(i * 0.3 + s) * 10 + Math.cos(i * 0.17 + s * 1.3) * 7 + Math.random() * 4,
          ),
        })),
      },
    },
  },
  beeswarm: {
    Component: BeeswarmChart,
    sample: {
      props: {
        width: 540,
        height: 280,
        data: Array.from({ length: 60 }, (_, i) => ({
          value: 20 + Math.round(60 * Math.abs(Math.sin(i * 0.7))) + (i % 7),
          label: `Item ${i + 1}`,
        })),
      },
    },
  },
  'population-pyramid': {
    Component: PopulationPyramidChart,
    sample: {
      props: {
        width: 540,
        height: 320,
        leftLabel: 'Male',
        rightLabel: 'Female',
        data: ['0–9', '10–19', '20–29', '30–39', '40–49', '50–59', '60–69', '70+'].map((group, i) => ({
          group,
          left: [320, 360, 380, 410, 400, 380, 320, 220][i],
          right: [305, 340, 370, 405, 415, 390, 340, 260][i],
        })),
      },
    },
  },

  // ── Temporal ────────────────────────────────────────────────────────────
  'stream-graph': {
    Component: StreamGraphChart,
    sample: {
      props: {
        width: 540,
        height: 280,
        labels: MONTHS,
        series: [
          { label: 'React', data: [12, 14, 18, 20, 24, 28, 30, 34, 38, 42, 46, 52] },
          { label: 'Vue', data: [8, 10, 12, 14, 16, 20, 22, 24, 24, 26, 28, 30] },
          { label: 'Svelte', data: [2, 3, 5, 6, 9, 12, 14, 18, 22, 24, 28, 32] },
          { label: 'Angular', data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10] },
        ],
      },
    },
  },
  bump: {
    Component: BumpChart,
    sample: {
      props: {
        width: 540,
        height: 300,
        periods: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        series: [
          { label: 'Alice', data: [1, 2, 1, 1, 1] },
          { label: 'Bob', data: [2, 1, 3, 2, 2] },
          { label: 'Carol', data: [3, 3, 2, 4, 3] },
          { label: 'Dave', data: [4, 4, 4, 3, 4] },
          { label: 'Eve', data: [5, 5, 5, 5, 5] },
        ],
      },
    },
  },
  gantt: {
    Component: GanttChart,
    sample: {
      props: {
        width: 540,
        height: 300,
        today: 18,
        tasks: [
          { label: 'Research', start: 0, end: 6 },
          { label: 'Design', start: 4, end: 12 },
          { label: 'Prototype', start: 10, end: 18 },
          { label: 'Implementation', start: 14, end: 28 },
          { label: 'Testing', start: 24, end: 32 },
          { label: 'Launch', start: 30, end: 34 },
        ],
      },
    },
  },
  horizon: {
    Component: HorizonChart,
    sample: {
      props: {
        width: 540,
        bands: 3,
        labels: MONTHS,
        series: [
          { label: 'Server A', data: MONTHS.map((_, i) => Math.sin(i * 0.5) * 40 + 10) },
          { label: 'Server B', data: MONTHS.map((_, i) => Math.cos(i * 0.3) * 35 + 5) },
          { label: 'Server C', data: MONTHS.map((_, i) => Math.sin(i * 0.7 + 1) * 50) },
          { label: 'Server D', data: MONTHS.map((_, i) => Math.cos(i * 0.4 + 2) * 30 - 10) },
        ],
      },
    },
  },

  // ── Flow / relational / geo ─────────────────────────────────────────────
  sankey: {
    Component: SankeyChart,
    sample: {
      props: {
        width: 540,
        height: 320,
        nodes: [
          { id: 'visit', label: 'Visit' },
          { id: 'signup', label: 'Signup' },
          { id: 'bounce', label: 'Bounce' },
          { id: 'activate', label: 'Activate' },
          { id: 'churn', label: 'Churn' },
          { id: 'paid', label: 'Paid' },
        ],
        links: [
          { source: 'visit', target: 'signup', value: 400 },
          { source: 'visit', target: 'bounce', value: 600 },
          { source: 'signup', target: 'activate', value: 260 },
          { source: 'signup', target: 'churn', value: 140 },
          { source: 'activate', target: 'paid', value: 180 },
          { source: 'activate', target: 'churn', value: 80 },
        ],
      },
    },
  },
  chord: {
    Component: ChordChart,
    sample: {
      props: {
        size: 340,
        labels: ['NA', 'EU', 'APAC', 'LATAM'],
        matrix: [
          [0, 8, 6, 3],
          [8, 0, 5, 2],
          [6, 5, 0, 4],
          [3, 2, 4, 0],
        ],
      },
    },
  },
  network: {
    Component: NetworkChart,
    sample: {
      props: {
        width: 540,
        height: 320,
        nodes: [
          { id: 'a', label: 'Core', group: 'g1', value: 10 },
          { id: 'b', label: 'API', group: 'g1', value: 7 },
          { id: 'c', label: 'DB', group: 'g1', value: 7 },
          { id: 'd', label: 'Web', group: 'g2', value: 8 },
          { id: 'e', label: 'Mobile', group: 'g2', value: 8 },
          { id: 'f', label: 'Admin', group: 'g2', value: 5 },
          { id: 'g', label: 'Queue', group: 'g3', value: 6 },
          { id: 'h', label: 'Worker', group: 'g3', value: 5 },
        ],
        links: [
          { source: 'a', target: 'b' }, { source: 'a', target: 'c' },
          { source: 'b', target: 'd' }, { source: 'b', target: 'e' },
          { source: 'b', target: 'f' }, { source: 'a', target: 'g' },
          { source: 'g', target: 'h' }, { source: 'h', target: 'c' },
        ],
      },
    },
  },
  'tile-map': {
    Component: TileMapChart,
    sample: {
      props: {
        width: 560,
        height: 340,
        data: [
          { id: 'wa', label: 'WA', value: 42, row: 0, col: 0 },
          { id: 'mt', label: 'MT', value: 18, row: 0, col: 1 },
          { id: 'nd', label: 'ND', value: 12, row: 0, col: 2 },
          { id: 'mn', label: 'MN', value: 36, row: 0, col: 3 },
          { id: 'or', label: 'OR', value: 38, row: 1, col: 0 },
          { id: 'id', label: 'ID', value: 20, row: 1, col: 1 },
          { id: 'wy', label: 'WY', value: 14, row: 1, col: 2 },
          { id: 'sd', label: 'SD', value: 18, row: 1, col: 3 },
          { id: 'ia', label: 'IA', value: 28, row: 1, col: 4 },
          { id: 'ca', label: 'CA', value: 92, row: 2, col: 0 },
          { id: 'nv', label: 'NV', value: 30, row: 2, col: 1 },
          { id: 'ut', label: 'UT', value: 26, row: 2, col: 2 },
          { id: 'co', label: 'CO', value: 48, row: 2, col: 3 },
          { id: 'ne', label: 'NE', value: 24, row: 2, col: 4 },
          { id: 'ny', label: 'NY', value: 82, row: 2, col: 5 },
          { id: 'az', label: 'AZ', value: 46, row: 3, col: 1 },
          { id: 'nm', label: 'NM', value: 22, row: 3, col: 2 },
          { id: 'ks', label: 'KS', value: 24, row: 3, col: 3 },
          { id: 'mo', label: 'MO', value: 36, row: 3, col: 4 },
          { id: 'tx', label: 'TX', value: 88, row: 4, col: 2 },
          { id: 'ok', label: 'OK', value: 28, row: 4, col: 3 },
          { id: 'ar', label: 'AR', value: 20, row: 4, col: 4 },
          { id: 'fl', label: 'FL', value: 68, row: 5, col: 5 },
        ],
      },
    },
  },
  'word-cloud': {
    Component: WordCloudChart,
    sample: {
      props: {
        width: 540,
        height: 320,
        words: [
          { text: 'React', value: 100 }, { text: 'TypeScript', value: 92 },
          { text: 'Vite', value: 72 }, { text: 'ESM', value: 48 },
          { text: 'SSR', value: 44 }, { text: 'Accessible', value: 60 },
          { text: 'Zero-runtime', value: 54 }, { text: 'OKLCH', value: 36 },
          { text: 'CSS', value: 68 }, { text: 'SVG', value: 56 },
          { text: 'Motion', value: 40 }, { text: 'Tokens', value: 38 },
          { text: 'Hooks', value: 32 }, { text: 'Charts', value: 50 },
          { text: 'Dark', value: 28 }, { text: 'Light', value: 26 },
          { text: 'Keyboard', value: 24 }, { text: 'Focus', value: 22 },
          { text: 'Palette', value: 30 }, { text: 'Grid', value: 20 },
        ],
      },
    },
  },
}
