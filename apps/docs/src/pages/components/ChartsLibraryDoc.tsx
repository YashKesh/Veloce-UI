import { LineChart, AreaChart, BarChart, PieChart, SparklineChart, GaugeChart, ScatterChart, CandleChart, RadarChart, FunnelChart, WaterfallChart, TreemapChart, HeatmapChart } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'LineChart', id: 'line' },
  { label: 'AreaChart', id: 'area' },
  { label: 'BarChart', id: 'bar' },
  { label: 'PieChart', id: 'pie' },
  { label: 'SparklineChart', id: 'sparkline' },
  { label: 'ScatterChart', id: 'scatter' },
  { label: 'CandleChart', id: 'candle' },
  { label: 'RadarChart', id: 'radar' },
  { label: 'FunnelChart', id: 'funnel' },
  { label: 'WaterfallChart', id: 'waterfall' },
  { label: 'TreemapChart', id: 'treemap' },
  { label: 'HeatmapChart', id: 'heatmap' },
  { label: 'GaugeChart', id: 'gauge' },
  { label: 'API', id: 'api' },
]

// Matches the data language used on the main /charts overview:
// weekly deploy traffic (W32–W39) and quarterly build volume.
const weeks = [
  { label: 'W32', value: 64 },
  { label: 'W33', value: 72 },
  { label: 'W34', value: 58 },
  { label: 'W35', value: 90 },
  { label: 'W36', value: 84 },
  { label: 'W37', value: 102 },
  { label: 'W38', value: 96 },
  { label: 'W39', value: 118 },
]

const quarters = [
  { label: 'W32', value: 64 },
  { label: 'W33', value: 72 },
  { label: 'W34', value: 58 },
  { label: 'W35', value: 90 },
  { label: 'W36', value: 84 },
  { label: 'W37', value: 102 },
  { label: 'W38', value: 96 },
  { label: 'W39', value: 118 },
]

const slices = [
  { label: 'Pro', value: 46 },
  { label: 'Team', value: 27 },
  { label: 'Hobby', value: 17 },
  { label: 'Enterprise', value: 10 },
]

export default function ChartsLibraryDoc() {
  return (
    <ComponentDoc
      slug="charts"
      name="Charts"
      description="Five chart primitives from veloce-ui. Pure SVG, theme-aware via CSS variables, SSR-safe. For richer showcases see the /charts catalogue."
      toc={TOC}
      preview={
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <LineChart data={weeks} height={200} />
          <BarChart data={quarters} height={200} showValues />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ LineChart, BarChart, PieChart, AreaChart, SparklineChart }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>LineChart{'\n'}
          {'  '}<span className="p">data=</span>{'{['}{'\n'}
          {'    '}{'{ label: "Jan", value: 24 },'}{'\n'}
          {'    '}{'{ label: "Feb", value: 38 },'}{'\n'}
          {'  '}{']}'}{'\n'}
          {'  '}<span className="p">height=</span>{'{200}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="line" title="LineChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <LineChart data={weeks} height={220} />
        </div>
        <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
          Smooth quadratic path with gradient underfill. Pass <code className="s">smooth={'{false}'}</code> for straight segments.
          Multi-series via <code className="s">series</code>: an array of <code className="s">{'{ label, data[], color? }'}</code>.
        </p>
      </Section>

      <Section id="area" title="AreaChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <AreaChart data={weeks} height={220} />
        </div>
        <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
          Variant of LineChart with a stronger area fill (42% → 2%). Same prop surface — great for showing a trend's magnitude.
        </p>
      </Section>

      <Section id="bar" title="BarChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <BarChart data={quarters} height={220} showValues />
        </div>
        <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
          Rounded top corners, auto-sized bars. Enable <code className="s">showValues</code> for inline value labels, or supply <code className="s">yFormat</code> to format axis ticks.
        </p>
      </Section>

      <Section id="pie" title="PieChart">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div className="vl-label" style={{ marginBottom: 10 }}>pie</div>
            <PieChart data={slices} size={200} />
          </div>
          <div>
            <div className="vl-label" style={{ marginBottom: 10 }}>donut</div>
            <PieChart data={slices} size={200} innerRadius={60} centerLabel="27%" centerSublabel="Team" />
          </div>
        </div>
        <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
          Pie or donut by setting <code className="s">innerRadius</code>. A 5-hue OKLCH palette is used when datum colors aren't provided.
          Tune the slice separator with <code className="s">padAngle</code> (degrees).
        </p>
      </Section>

      <Section id="sparkline" title="SparklineChart">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <SparklineChart data={[12, 14, 13, 18, 17, 22, 21, 26, 30]} />
          <SparklineChart data={[40, 38, 41, 37, 35, 36, 33, 31, 30]} color="var(--err)" />
          <SparklineChart data={[5, 9, 7, 12, 10, 14, 13, 15, 19]} showDot />
        </div>
        <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
          Dense inline trend indicator — no axes, no grid. Pass a flat <code className="s">number[]</code>. Toggle an end-dot with <code className="s">showDot</code>.
        </p>
      </Section>

      <Section id="scatter" title="ScatterChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <ScatterChart
            width={520}
            height={220}
            data={[
              { x: 12, y: 24 }, { x: 18, y: 42 }, { x: 24, y: 36 }, { x: 32, y: 58 },
              { x: 40, y: 44 }, { x: 48, y: 62 }, { x: 55, y: 70 }, { x: 62, y: 68 },
              { x: 70, y: 80 }, { x: 78, y: 72 }, { x: 86, y: 88 }, { x: 94, y: 92 },
            ]}
          />
        </div>
      </Section>

      <Section id="candle" title="CandleChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <CandleChart
            width={520}
            height={220}
            data={[
              { label: 'Mon', open: 120, high: 128, low: 118, close: 126 },
              { label: 'Tue', open: 126, high: 130, low: 122, close: 124 },
              { label: 'Wed', open: 124, high: 132, low: 123, close: 131 },
              { label: 'Thu', open: 131, high: 136, low: 129, close: 134 },
              { label: 'Fri', open: 134, high: 138, low: 128, close: 130 },
            ]}
          />
        </div>
      </Section>

      <Section id="radar" title="RadarChart">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <RadarChart
            size={260}
            data={[
              { axis: 'Speed', value: 82 },
              { axis: 'Quality', value: 74 },
              { axis: 'Coverage', value: 68 },
              { axis: 'Scale', value: 90 },
              { axis: 'Cost', value: 56 },
              { axis: 'UX', value: 86 },
            ]}
          />
        </div>
      </Section>

      <Section id="funnel" title="FunnelChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <FunnelChart
            width={520}
            height={240}
            data={[
              { label: 'Visits', value: 10000 },
              { label: 'Sign-ups', value: 4200 },
              { label: 'Activated', value: 2600 },
              { label: 'Paid', value: 980 },
            ]}
          />
        </div>
      </Section>

      <Section id="waterfall" title="WaterfallChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <WaterfallChart
            width={520}
            height={240}
            showValues
            data={[
              { label: 'Start', value: 100, type: 'total' },
              { label: 'Sales', value: 48 },
              { label: 'Refunds', value: -12 },
              { label: 'Fees', value: -8 },
              { label: 'End', value: 0, type: 'total' },
            ]}
          />
        </div>
      </Section>

      <Section id="treemap" title="TreemapChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <TreemapChart
            width={520}
            height={240}
            data={[
              { label: 'Pro', value: 46 },
              { label: 'Team', value: 27 },
              { label: 'Hobby', value: 17 },
              { label: 'Enterprise', value: 10 },
              { label: 'Trial', value: 6 },
            ]}
          />
        </div>
      </Section>

      <Section id="heatmap" title="HeatmapChart">
        <div className="vl-panel" style={{ padding: 24 }}>
          <HeatmapChart
            width={520}
            height={220}
            data={(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).flatMap((d, di) =>
              ['9', '12', '15', '18', '21'].map((h, hi) => ({ x: h, y: d, value: 20 + ((di * 13 + hi * 17) % 70) })),
            )}
          />
        </div>
      </Section>

      <Section id="gauge" title="GaugeChart">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GaugeChart value={72} label="72" sublabel="Lighthouse performance" />
          <GaugeChart value={38} label="38" sublabel="Needs work" color="var(--warn)" />
        </div>
        <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
          Segmented track with threshold bands, needle + centre value, and tick marks matching the <code className="s">/charts/gauge</code> language.
          Hover over the colored value arc to see a formatted tooltip ("72 · 72% of 100"). The arc sweeps in on mount and tweens the needle when
          <code className="s">value</code> changes; <code className="s">prefers-reduced-motion</code> is respected. Opt out with
          <code className="s">animated={'{false}'}</code> or <code className="s">showHoverTooltip={'{false}'}</code>; supply <code className="s">format</code> to control the tooltip number.
        </p>
      </Section>

      <Section id="api" title="API">
        <pre className="vl-code" style={{ padding: '14px 16px', fontSize: 12.5, lineHeight: 1.65 }}>
{`LineChart     { data, series?, width, height, showGrid, showDots, smooth, strokeWidth, color?, yFormat? }
AreaChart     { data, series?, width, height, showGrid, smooth, color?, yFormat? }
BarChart      { data, series?, width, height, barGap, groupGap, showGrid, showValues, color?, yFormat? }
PieChart      { data: { label, value, color? }[], size, innerRadius?, padAngle, showLabels?, centerLabel?, centerSublabel? }
SparklineChart{ data: number[], width, height, color?, strokeWidth, showDot? }
ScatterChart  { data: { x, y, label? }[], series?, width, height, showGrid, dotRadius, color?, xLabel?, yLabel? }
CandleChart   { data: { label, open, high, low, close }[], width, height, showGrid, upColor?, downColor? }
RadarChart    { data: { axis, value }[], series?, size, max?, levels }
FunnelChart   { data: { label, value, color? }[], width, height, gap }
WaterfallChart{ data: { label, value, type?: 'bar'|'total' }[], width, height, showValues }
TreemapChart  { data: { label, value, color? }[], width, height, padding }
HeatmapChart  { data: { x, y, value }[], width, height, color? }
GaugeChart    { value, max, size, thickness, color?, thresholds?, label?, sublabel?, format?, animated?, showHoverTooltip?, showNeedle?, showTicks?, showEndLabels? }`}
        </pre>
        <p style={{ marginTop: 10, color: 'var(--fg-3)', fontSize: 12.5 }}>
          All components forward refs to the underlying <code className="s">&lt;svg&gt;</code> and carry <code className="s">data-vl-chart</code> for style hooks.
        </p>
      </Section>
    </ComponentDoc>
  )
}
