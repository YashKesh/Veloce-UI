// Aggregates the base chart anatomy pages (chartsData) with the expanded
// family pages (data/*). Kept separate from chartsData so the family files can
// import helpers from chartsData without a circular dependency.
import { CHART_PAGES as BASE_PAGES, CHART_PAGE_ORDER as BASE_ORDER, type ChartPage } from './chartsData'
import { COMPARISON_PAGES } from './data/comparison'
import { HIERARCHY_PAGES } from './data/hierarchy'
import { DISTRIBUTION_PAGES } from './data/distribution'
import { TEMPORAL_PAGES } from './data/temporal'
import { FLOW_PAGES } from './data/flow'
import { LIVE_SAMPLES } from './liveSamples'

export type { ChartPage }

const MERGED: Record<string, ChartPage> = {
  ...BASE_PAGES,
  ...COMPARISON_PAGES,
  ...HIERARCHY_PAGES,
  ...DISTRIBUTION_PAGES,
  ...TEMPORAL_PAGES,
  ...FLOW_PAGES,
}

// Attach live Component + sample to each page where available.
for (const [key, entry] of Object.entries(LIVE_SAMPLES)) {
  const page = MERGED[key]
  if (page) {
    MERGED[key] = { ...page, Component: entry.Component, sample: entry.sample }
  }
}

export const CHART_PAGES: Record<string, ChartPage> = MERGED

export const CHART_PAGE_ORDER = [
  ...BASE_ORDER,
  // Comparison
  'bullet', 'lollipop', 'dumbbell', 'slope', 'radial-bar', 'parallel-coordinates',
  // Part-to-whole / hierarchical
  'sunburst', 'dendrogram', 'venn', 'waffle', 'marimekko', 'nightingale',
  // Distribution
  'histogram', 'box-plot', 'violin', 'ridgeline', 'beeswarm', 'population-pyramid',
  // Temporal
  'stream-graph', 'bump', 'gantt', 'horizon',
  // Flow / relational / geo
  'sankey', 'chord', 'network', 'tile-map', 'word-cloud',
] as const
