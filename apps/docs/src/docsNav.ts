import type { SidebarGroup } from './components/DocsShell'

export interface ComponentEntry {
  label: string
  slug: string
  comingSoon?: boolean
}

export const COMPONENTS: ComponentEntry[] = [
  { label: 'Button', slug: 'button' },
  { label: 'Badge', slug: 'badge' },
  { label: 'Chip', slug: 'chip' },
  { label: 'Card', slug: 'card' },
  { label: 'Avatar', slug: 'avatar' },
  { label: 'Separator', slug: 'separator' },
  { label: 'Input', slug: 'input' },
  { label: 'Textarea', slug: 'textarea' },
  { label: 'Select', slug: 'select' },
  { label: 'Checkbox', slug: 'checkbox' },
  { label: 'Radio', slug: 'radio' },
  { label: 'Switch', slug: 'switch' },
  { label: 'Slider', slug: 'slider' },
  { label: 'Toggle group', slug: 'toggle-group' },
  { label: 'Tabs', slug: 'tabs' },
  { label: 'Dialog', slug: 'dialog' },
  { label: 'Sheet', slug: 'sheet' },
  { label: 'Dropdown menu', slug: 'dropdown' },
  { label: 'Popover', slug: 'popover' },
  { label: 'Tooltip', slug: 'tooltip' },
  { label: 'Command palette', slug: 'command' },
  { label: 'Toast', slug: 'toast' },
  { label: 'Alert', slug: 'alert' },
  { label: 'Progress', slug: 'progress' },
  { label: 'Spinner', slug: 'spinner' },
  { label: 'Skeleton', slug: 'skeleton' },
  { label: 'Empty state', slug: 'empty-state' },
  { label: 'Breadcrumbs', slug: 'breadcrumbs' },
  { label: 'Pagination', slug: 'pagination' },
  { label: 'Stepper', slug: 'stepper' },
  { label: 'Accordion', slug: 'accordion' },
  { label: 'Navbar', slug: 'navbar' },
  { label: 'Sidebar', slug: 'sidebar' },
  { label: 'Data grid', slug: 'data-grid' },
  { label: 'Table', slug: 'table' },
  { label: 'Charts', slug: 'charts' },
  { label: 'Layout primitives', slug: 'layout' },
  { label: 'Motion utilities', slug: 'motion-utilities' },
]

const item = (label: string, slug: string) => {
  const entry = COMPONENTS.find((c) => c.slug === slug)
  return { label, to: `/components/${slug}`, ...(entry?.comingSoon ? { chip: 'soon' } : {}) }
}

/** The 16 series types shown on /charts/catalogue; ids match the tile anchors. */
export const CATALOGUE_SERIES = [
  { label: 'Line', id: 'line' },
  { label: 'Area · stacked', id: 'area-stacked' },
  { label: 'Step', id: 'step' },
  { label: 'Bar · horizontal', id: 'bar-horizontal' },
  { label: 'Bar · stacked', id: 'bar-stacked' },
  { label: 'Composed', id: 'composed' },
  { label: 'Scatter', id: 'scatter' },
  { label: 'Candlestick', id: 'candlestick' },
  { label: 'Pie', id: 'pie' },
  { label: 'Radar', id: 'radar' },
  { label: 'Funnel', id: 'funnel' },
  { label: 'Waterfall', id: 'waterfall' },
  { label: 'Treemap', id: 'treemap' },
  { label: 'Gauge · arc', id: 'gauge-arc' },
  { label: 'Sparkline', id: 'sparkline' },
  { label: 'Heatmap · Donut', id: 'heatmap-donut' },
]

const CHART_PAGE_SUB = [
  { label: 'Anatomy', id: 'anatomy' },
  { label: 'Composition', id: 'composition' },
  { label: 'Variants', id: 'variants' },
  { label: 'Motion', id: 'motion' },
  { label: 'Accessibility', id: 'accessibility' },
  { label: 'API', id: 'api' },
]

export const DOCS_SIDEBAR: SidebarGroup[] = [
  {
    title: 'Getting started',
    items: [
      { label: 'Introduction', to: '/' },
      ...(import.meta.env.DEV
        ? [{ label: 'Playground', to: '/playground', chip: 'LIVE' }]
        : []),
      { label: 'Installation', to: '/docs/installation' },
      { label: 'Usage', to: '/docs/usage' },
      { label: 'CLI', to: '/docs/installation#step-1' },
      { label: 'Theming', to: '/docs/tokens' },
      { label: 'Dark mode', to: '/accents' },
      { label: 'Motion system', to: '/docs/motion' },
      { label: 'Accessibility', to: '/docs/motion#reduced' },
      { label: 'Figma kit' },
      { label: 'Changelog' },
    ],
  },
  {
    title: 'Frameworks',
    items: [
      { label: 'Next.js', to: '/docs/installation#frameworks' },
      { label: 'Vite', to: '/docs/installation#frameworks-vite' },
      { label: 'Remix', to: '/docs/installation#frameworks-remix' },
      { label: 'Astro', to: '/docs/installation#frameworks-astro' },
    ],
  },
  {
    title: 'Components',
    items: [{ label: `All components (${COMPONENTS.length})`, to: '/components' }],
    sections: [
      {
        title: 'Primitives',
        items: [
          { label: 'Overview', to: '/components#primitives' },
          item('Button', 'button'), item('Badge', 'badge'), item('Chip', 'chip'),
          item('Card', 'card'), item('Avatar', 'avatar'), item('Separator', 'separator'),
        ],
      },
      {
        title: 'Forms',
        items: [
          { label: 'Overview', to: '/components#forms' },
          item('Input', 'input'), item('Textarea', 'textarea'), item('Select', 'select'),
          item('Checkbox', 'checkbox'), item('Radio', 'radio'), item('Switch', 'switch'),
          item('Slider', 'slider'), item('Toggle group', 'toggle-group'), item('Tabs', 'tabs'),
        ],
      },
      {
        title: 'Overlays',
        items: [
          { label: 'Overview', to: '/components#overlays' },
          item('Dialog', 'dialog'), item('Sheet', 'sheet'), item('Dropdown menu', 'dropdown'),
          item('Popover', 'popover'), item('Tooltip', 'tooltip'),
          { label: 'Command palette', to: '/components/command', chip: 'NEW' },
        ],
      },
      {
        title: 'Feedback',
        items: [
          { label: 'Overview', to: '/components#feedback' },
          item('Toast', 'toast'), item('Alert', 'alert'), item('Progress', 'progress'),
          item('Spinner', 'spinner'), item('Skeleton', 'skeleton'), item('Empty state', 'empty-state'),
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Overview', to: '/components#navigation' },
          {
            label: 'Navbar', to: '/components/navbar',
            sub: [
              { label: 'Anatomy', id: 'anatomy' },
              { label: 'Composition', id: 'composition' },
              { label: 'Variants', id: 'variants' },
              { label: 'Accessibility', id: 'accessibility' },
              { label: 'API', id: 'api' },
            ],
          },
          {
            label: 'Sidebar', to: '/components/sidebar',
            sub: [
              { label: 'Anatomy', id: 'anatomy' },
              { label: 'Composition', id: 'composition' },
              { label: 'Variants', id: 'variants' },
              { label: 'Collapse behavior', id: 'collapse-behavior' },
              { label: 'Accessibility', id: 'accessibility' },
              { label: 'API', id: 'api' },
            ],
          },
          item('Breadcrumbs', 'breadcrumbs'), item('Pagination', 'pagination'),
          item('Stepper', 'stepper'), item('Accordion', 'accordion'),
        ],
      },
      {
        title: 'Data',
        items: [
          { label: 'Overview', to: '/components#data' },
          {
            label: 'Data grid', to: '/components/data-grid',
            sub: [
              { label: 'Anatomy', id: 'anatomy' },
              { label: 'Composition', id: 'composition' },
              { label: 'Columns', id: 'columns' },
              { label: 'Filtering & sort', id: 'filtering' },
              { label: 'Selection & editing', id: 'selection' },
              { label: 'Grouping & tree', id: 'grouping' },
              { label: 'Scale & state', id: 'scale' },
              { label: 'Export & types', id: 'export' },
              { label: 'API', id: 'api' },
            ],
          },
          {
            label: 'Table', to: '/components/table',
            sub: [
              { label: 'Anatomy', id: 'anatomy' },
              { label: 'Composition', id: 'composition' },
              { label: 'Row variants & density', id: 'row-variants' },
              { label: 'Cell variants', id: 'cell-variants' },
              { label: 'Sticky header & scroll', id: 'sticky' },
              { label: 'Accessibility', id: 'accessibility' },
              { label: 'API', id: 'api' },
            ],
          },
        ],
      },
      {
        title: 'Charts',
        items: [
          { label: 'Overview', to: '/charts', chip: 'NEW' },
          { label: 'Catalogue', to: '/charts/catalogue', sub: CATALOGUE_SERIES },
          {
            label: 'Line', to: '/docs/charts/line',
            sub: [
              { label: 'Basics', id: 'basics' },
              { label: 'Area & stacking', id: 'area-stacking' },
              { label: 'Tooltip & crosshair', id: 'tooltip-crosshair' },
              { label: 'Draw-in motion', id: 'draw-in-motion' },
              { label: 'Components & API', id: 'components-api' },
            ],
          },
          { label: 'Area', to: '/docs/charts/area', sub: CHART_PAGE_SUB },
          { label: 'Bar', to: '/docs/charts/bar', sub: CHART_PAGE_SUB },
          { label: 'Pie & Donut', to: '/docs/charts/pie-donut', sub: CHART_PAGE_SUB },
          { label: 'Scatter', to: '/docs/charts/scatter', sub: CHART_PAGE_SUB },
          { label: 'Candlestick', to: '/docs/charts/candle', sub: CHART_PAGE_SUB },
          { label: 'Radar', to: '/docs/charts/radar', sub: CHART_PAGE_SUB },
          { label: 'Funnel', to: '/docs/charts/funnel', sub: CHART_PAGE_SUB },
          { label: 'Waterfall', to: '/docs/charts/waterfall', sub: CHART_PAGE_SUB },
          { label: 'Treemap', to: '/docs/charts/treemap', sub: CHART_PAGE_SUB },
          { label: 'Heatmap', to: '/docs/charts/heatmap', chip: 'NEW', sub: CHART_PAGE_SUB },
          { label: 'Gauge', to: '/docs/charts/gauge', sub: CHART_PAGE_SUB },
          { label: 'Sparkline', to: '/docs/charts/sparkline', sub: CHART_PAGE_SUB },
        ],
      },
      {
        title: 'Layout',
        items: [
          { label: 'Overview', to: '/components#layout' },
          item('Layout primitives', 'layout'),
        ],
      },
    ],
  },
  {
    title: 'Motion',
    items: [
      { label: 'Principles', to: '/docs/motion#four-rules' },
      { label: 'Tokens', to: '/docs/motion#anatomy' },
      { label: 'Choreography', to: '/docs/motion#write-once' },
      { label: 'Reduced motion', to: '/docs/motion#reduced' },
    ],
  },
  {
    title: 'Utilities',
    items: [
      { label: 'Presence', to: '/components/motion-utilities#presence' },
      { label: 'Stagger', to: '/components/motion-utilities#stagger' },
      { label: 'NumberFlow', to: '/components/motion-utilities#numberflow' },
      { label: 'useMotionPreference', to: '/components/motion-utilities#use-motion-preference' },
      { label: 'Overview', to: '/motion-utilities' },
    ],
  },
]

export function prevNext(slug: string): { prev?: ComponentEntry; next?: ComponentEntry } {
  const i = COMPONENTS.findIndex((c) => c.slug === slug)
  return { prev: COMPONENTS[i - 1], next: COMPONENTS[i + 1] }
}
