import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeControls } from './components/ThemeControls'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const Landing = lazy(() => import('./pages/Landing'))
const Builder = lazy(() => import('./pages/Builder'))
const ThemeStudio = lazy(() => import('./pages/ThemeStudio'))
const DocsBuilder = lazy(() => import('./pages/DocsBuilder'))
const DocsThemeStudio = lazy(() => import('./pages/DocsThemeStudio'))
const DocsDialog = lazy(() => import('./pages/DocsDialog'))
const Gallery = lazy(() => import('./pages/Gallery'))
const TokensPage = lazy(() => import('./pages/TokensPage'))
const Accents = lazy(() => import('./pages/Accents'))
const DocsInstallation = lazy(() => import('./pages/DocsInstallation'))
const DocsCustomization = lazy(() => import('./pages/DocsCustomization'))
const DocsMotion = lazy(() => import('./pages/DocsMotion'))
const ButtonDoc = lazy(() => import('./pages/components/ButtonDoc'))
const InputDoc = lazy(() => import('./pages/components/InputDoc'))
const SwitchDoc = lazy(() => import('./pages/components/SwitchDoc'))
const ToggleDoc = lazy(() => import('./pages/components/ToggleDoc'))
const LabelDoc = lazy(() => import('./pages/components/LabelDoc'))
const CollapsibleDoc = lazy(() => import('./pages/components/CollapsibleDoc'))
const AlertDialogDoc = lazy(() => import('./pages/components/AlertDialogDoc'))
const PortalDoc = lazy(() => import('./pages/components/PortalDoc'))
const VisuallyHiddenDoc = lazy(() => import('./pages/components/VisuallyHiddenDoc'))
const SlotDoc = lazy(() => import('./pages/components/SlotDoc'))
const KbdDoc = lazy(() => import('./pages/components/KbdDoc'))
const CodeDoc = lazy(() => import('./pages/components/CodeDoc'))
const MarkDoc = lazy(() => import('./pages/components/MarkDoc'))
const BlockquoteDoc = lazy(() => import('./pages/components/BlockquoteDoc'))
const NumberInputDoc = lazy(() => import('./pages/components/NumberInputDoc'))
const PinInputDoc = lazy(() => import('./pages/components/PinInputDoc'))
const RatingDoc = lazy(() => import('./pages/components/RatingDoc'))
const HoverCardDoc = lazy(() => import('./pages/components/HoverCardDoc'))
const ContextMenuDoc = lazy(() => import('./pages/components/ContextMenuDoc'))
const DrawerDoc = lazy(() => import('./pages/components/DrawerDoc'))
const ScrollAreaDoc = lazy(() => import('./pages/components/ScrollAreaDoc'))
const CarouselDoc = lazy(() => import('./pages/components/CarouselDoc'))
const TimelineDoc = lazy(() => import('./pages/components/TimelineDoc'))
const TreeDoc = lazy(() => import('./pages/components/TreeDoc'))
const ComboboxDoc = lazy(() => import('./pages/components/ComboboxDoc'))
const MultiSelectDoc = lazy(() => import('./pages/components/MultiSelectDoc'))
const FileUploadDoc = lazy(() => import('./pages/components/FileUploadDoc'))
const FormDoc = lazy(() => import('./pages/components/FormDoc'))
const DatePickerDoc = lazy(() => import('./pages/components/DatePickerDoc'))
const ChatMessageDoc = lazy(() => import('./pages/components/ChatMessageDoc'))
const StreamingTextDoc = lazy(() => import('./pages/components/StreamingTextDoc'))
const PromptInputDoc = lazy(() => import('./pages/components/PromptInputDoc'))
const ToolCallDoc = lazy(() => import('./pages/components/ToolCallDoc'))
const CitationDoc = lazy(() => import('./pages/components/CitationDoc'))
const AgentAvatarDoc = lazy(() => import('./pages/components/AgentAvatarDoc'))
const TokenCounterDoc = lazy(() => import('./pages/components/TokenCounterDoc'))
const SuggestionChipsDoc = lazy(() => import('./pages/components/SuggestionChipsDoc'))
const ThinkingIndicatorDoc = lazy(() => import('./pages/components/ThinkingIndicatorDoc'))
const DiffViewerDoc = lazy(() => import('./pages/components/DiffViewerDoc'))
const ColorPickerDoc = lazy(() => import('./pages/components/ColorPickerDoc'))
const ColorInputDoc = lazy(() => import('./pages/components/ColorInputDoc'))
const ColorSwatchDoc = lazy(() => import('./pages/components/ColorSwatchDoc'))
const ContrastCheckerDoc = lazy(() => import('./pages/components/ContrastCheckerDoc'))
const ChartsSparklineGridDoc = lazy(() => import('./pages/charts/ChartsSparklineGridDoc'))
const ChartsAnnotationsDoc = lazy(() => import('./pages/charts/ChartsAnnotationsDoc'))
const ChartsBrushDoc = lazy(() => import('./pages/charts/ChartsBrushDoc'))
const ChartsLiveLineDoc = lazy(() => import('./pages/charts/ChartsLiveLineDoc'))
const ChartsComparisonDoc = lazy(() => import('./pages/charts/ChartsComparisonDoc'))
const GradientBuilderDoc = lazy(() => import('./pages/components/GradientBuilderDoc'))
const ShadowBuilderDoc = lazy(() => import('./pages/components/ShadowBuilderDoc'))
const LinkedListDoc = lazy(() => import('./pages/components/LinkedListDoc'))
const DsaStackDoc = lazy(() => import('./pages/components/DsaStackDoc'))
const QueueDoc = lazy(() => import('./pages/components/QueueDoc'))
const BinaryTreeDoc = lazy(() => import('./pages/components/BinaryTreeDoc'))
const GraphDoc = lazy(() => import('./pages/components/GraphDoc'))
const MarketingBlocksDoc = lazy(() => import('./pages/components/MarketingBlocksDoc'))
const MarketingBlockDoc = lazy(() => import('./pages/components/MarketingBlockDoc'))
const DashboardIndex = lazy(() => import('./pages/dashboards/DashboardIndex'))
const SaaSMetricsDashboard = lazy(() => import('./pages/dashboards/SaaSMetrics'))
const AnalyticsDashboard = lazy(() => import('./pages/dashboards/Analytics'))
const EcommerceAdminDashboard = lazy(() => import('./pages/dashboards/EcommerceAdmin'))
const FinanceDashboard = lazy(() => import('./pages/dashboards/Finance'))
const DevOpsDashboard = lazy(() => import('./pages/dashboards/DevOps'))
const ProjectManagementDashboard = lazy(() => import('./pages/dashboards/ProjectManagement'))
const HRDashboard = lazy(() => import('./pages/dashboards/HR'))
const AdminUsersDashboard = lazy(() => import('./pages/dashboards/AdminUsers'))
const SettingsDashboard = lazy(() => import('./pages/dashboards/Settings'))
const InboxDashboard = lazy(() => import('./pages/dashboards/Inbox'))
const CRMPipelineDashboard = lazy(() => import('./pages/dashboards/CRMPipeline'))
const HelpdeskDashboard = lazy(() => import('./pages/dashboards/Helpdesk'))
const MarketingSiteDashboard = lazy(() => import('./pages/dashboards/MarketingSite'))
const SocialSchedulerDashboard = lazy(() => import('./pages/dashboards/SocialScheduler'))
const CommandDoc = lazy(() => import('./pages/components/CommandDoc'))
const ToastDoc = lazy(() => import('./pages/components/ToastDoc'))
const ProgressDoc = lazy(() => import('./pages/components/ProgressDoc'))
const SkeletonDoc = lazy(() => import('./pages/components/SkeletonDoc'))
const DataGridDoc = lazy(() => import('./pages/components/DataGridDoc'))
const BadgeDoc = lazy(() => import('./pages/components/BadgeDoc'))
const CardDoc = lazy(() => import('./pages/components/CardDoc'))
const SelectDoc = lazy(() => import('./pages/components/SelectDoc'))
const CheckboxDoc = lazy(() => import('./pages/components/CheckboxDoc'))
const TabsDoc = lazy(() => import('./pages/components/TabsDoc'))
const DropdownDoc = lazy(() => import('./pages/components/DropdownDoc'))
const PopoverDoc = lazy(() => import('./pages/components/PopoverDoc'))
const TooltipDoc = lazy(() => import('./pages/components/TooltipDoc'))
const AccordionDoc = lazy(() => import('./pages/components/AccordionDoc'))
const ChipDoc = lazy(() => import('./pages/components/ChipDoc'))
const AvatarDoc = lazy(() => import('./pages/components/AvatarDoc'))
const SeparatorDoc = lazy(() => import('./pages/components/SeparatorDoc'))
const TextareaDoc = lazy(() => import('./pages/components/TextareaDoc'))
const RadioDoc = lazy(() => import('./pages/components/RadioDoc'))
const SliderDoc = lazy(() => import('./pages/components/SliderDoc'))
const ToggleGroupDoc = lazy(() => import('./pages/components/ToggleGroupDoc'))
const SheetDoc = lazy(() => import('./pages/components/SheetDoc'))
const AlertDoc = lazy(() => import('./pages/components/AlertDoc'))
const SpinnerDoc = lazy(() => import('./pages/components/SpinnerDoc'))
const EmptyStateDoc = lazy(() => import('./pages/components/EmptyStateDoc'))
const BreadcrumbsDoc = lazy(() => import('./pages/components/BreadcrumbsDoc'))
const PaginationDoc = lazy(() => import('./pages/components/PaginationDoc'))
const StepperDoc = lazy(() => import('./pages/components/StepperDoc'))
const LayoutDoc = lazy(() => import('./pages/components/LayoutDoc'))
const MotionUtilitiesDoc = lazy(() => import('./pages/components/MotionUtilitiesDoc'))
const TableDoc = lazy(() => import('./pages/components/TableDoc'))
const NavbarDoc = lazy(() => import('./pages/components/NavbarDoc'))
const SidebarDoc = lazy(() => import('./pages/components/SidebarDoc'))
const ChartsLibraryDoc = lazy(() => import('./pages/components/ChartsLibraryDoc'))
const ChartsPage = lazy(() => import('./pages/ChartsPage'))
const ChartsCataloguePage = lazy(() => import('./pages/ChartsCataloguePage'))
const ChartsLineDoc = lazy(() => import('./pages/ChartsLineDoc'))
const MotionUtilitiesShowcase = lazy(() => import('./pages/MotionUtilitiesShowcase'))
const ChartsAreaDoc = lazy(() => import('./pages/charts/ChartsAreaDoc'))
const ChartsBarDoc = lazy(() => import('./pages/charts/ChartsBarDoc'))
const ChartsPieDonutDoc = lazy(() => import('./pages/charts/ChartsPieDonutDoc'))
const ChartsScatterDoc = lazy(() => import('./pages/charts/ChartsScatterDoc'))
const ChartsCandleDoc = lazy(() => import('./pages/charts/ChartsCandleDoc'))
const ChartsRadarDoc = lazy(() => import('./pages/charts/ChartsRadarDoc'))
const ChartsFunnelDoc = lazy(() => import('./pages/charts/ChartsFunnelDoc'))
const ChartsWaterfallDoc = lazy(() => import('./pages/charts/ChartsWaterfallDoc'))
const ChartsTreemapDoc = lazy(() => import('./pages/charts/ChartsTreemapDoc'))
const ChartsSparklineDoc = lazy(() => import('./pages/charts/ChartsSparklineDoc'))
const ChartsGaugeDoc = lazy(() => import('./pages/charts/ChartsGaugeDoc'))
const ChartsHeatmapDoc = lazy(() => import('./pages/charts/ChartsHeatmapDoc'))
const ChartsBulletDoc = lazy(() => import('./pages/charts/ChartsBulletDoc'))
const ChartsLollipopDoc = lazy(() => import('./pages/charts/ChartsLollipopDoc'))
const ChartsDumbbellDoc = lazy(() => import('./pages/charts/ChartsDumbbellDoc'))
const ChartsSlopeDoc = lazy(() => import('./pages/charts/ChartsSlopeDoc'))
const ChartsRadialBarDoc = lazy(() => import('./pages/charts/ChartsRadialBarDoc'))
const ChartsParallelCoordinatesDoc = lazy(() => import('./pages/charts/ChartsParallelCoordinatesDoc'))
const ChartsSunburstDoc = lazy(() => import('./pages/charts/ChartsSunburstDoc'))
const ChartsDendrogramDoc = lazy(() => import('./pages/charts/ChartsDendrogramDoc'))
const ChartsVennDoc = lazy(() => import('./pages/charts/ChartsVennDoc'))
const ChartsWaffleDoc = lazy(() => import('./pages/charts/ChartsWaffleDoc'))
const ChartsMarimekkoDoc = lazy(() => import('./pages/charts/ChartsMarimekkoDoc'))
const ChartsNightingaleDoc = lazy(() => import('./pages/charts/ChartsNightingaleDoc'))
const ChartsHistogramDoc = lazy(() => import('./pages/charts/ChartsHistogramDoc'))
const ChartsBoxPlotDoc = lazy(() => import('./pages/charts/ChartsBoxPlotDoc'))
const ChartsViolinDoc = lazy(() => import('./pages/charts/ChartsViolinDoc'))
const ChartsRidgelineDoc = lazy(() => import('./pages/charts/ChartsRidgelineDoc'))
const ChartsBeeswarmDoc = lazy(() => import('./pages/charts/ChartsBeeswarmDoc'))
const ChartsPopulationPyramidDoc = lazy(() => import('./pages/charts/ChartsPopulationPyramidDoc'))
const ChartsStreamGraphDoc = lazy(() => import('./pages/charts/ChartsStreamGraphDoc'))
const ChartsBumpDoc = lazy(() => import('./pages/charts/ChartsBumpDoc'))
const ChartsGanttDoc = lazy(() => import('./pages/charts/ChartsGanttDoc'))
const ChartsHorizonDoc = lazy(() => import('./pages/charts/ChartsHorizonDoc'))
const ChartsSankeyDoc = lazy(() => import('./pages/charts/ChartsSankeyDoc'))
const ChartsChordDoc = lazy(() => import('./pages/charts/ChartsChordDoc'))
const ChartsNetworkDoc = lazy(() => import('./pages/charts/ChartsNetworkDoc'))
const ChartsTileMapDoc = lazy(() => import('./pages/charts/ChartsTileMapDoc'))
const ChartsWordCloudDoc = lazy(() => import('./pages/charts/ChartsWordCloudDoc'))
const ContactPage = lazy(() => import('./pages/legal/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/legal/TermsPage'))
const AboutPage = lazy(() => import('./pages/legal/AboutPage'))
const Playground = import.meta.env.DEV
  ? lazy(() => import('./pages/Playground'))
  : null
const Usage = lazy(() => import('./pages/Usage'))

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/theme" element={<ThemeStudio />} />
          <Route path="/docs/builder" element={<DocsBuilder />} />
          <Route path="/docs/theme-studio" element={<DocsThemeStudio />} />
          <Route path="/components" element={<Gallery />} />
          <Route path="/components/button" element={<ButtonDoc />} />
          <Route path="/components/input" element={<InputDoc />} />
          <Route path="/components/switch" element={<SwitchDoc />} />
          <Route path="/components/toggle" element={<ToggleDoc />} />
          <Route path="/components/label" element={<LabelDoc />} />
          <Route path="/components/collapsible" element={<CollapsibleDoc />} />
          <Route path="/components/alert-dialog" element={<AlertDialogDoc />} />
          <Route path="/components/portal" element={<PortalDoc />} />
          <Route path="/components/visually-hidden" element={<VisuallyHiddenDoc />} />
          <Route path="/components/slot" element={<SlotDoc />} />
          <Route path="/components/kbd" element={<KbdDoc />} />
          <Route path="/components/code" element={<CodeDoc />} />
          <Route path="/components/mark" element={<MarkDoc />} />
          <Route path="/components/blockquote" element={<BlockquoteDoc />} />
          <Route path="/components/number-input" element={<NumberInputDoc />} />
          <Route path="/components/pin-input" element={<PinInputDoc />} />
          <Route path="/components/rating" element={<RatingDoc />} />
          <Route path="/components/hover-card" element={<HoverCardDoc />} />
          <Route path="/components/context-menu" element={<ContextMenuDoc />} />
          <Route path="/components/drawer" element={<DrawerDoc />} />
          <Route path="/components/scroll-area" element={<ScrollAreaDoc />} />
          <Route path="/components/carousel" element={<CarouselDoc />} />
          <Route path="/components/timeline" element={<TimelineDoc />} />
          <Route path="/components/tree" element={<TreeDoc />} />
          <Route path="/components/combobox" element={<ComboboxDoc />} />
          <Route path="/components/multi-select" element={<MultiSelectDoc />} />
          <Route path="/components/file-upload" element={<FileUploadDoc />} />
          <Route path="/components/form" element={<FormDoc />} />
          <Route path="/components/date-picker" element={<DatePickerDoc />} />
          <Route path="/components/chat-message" element={<ChatMessageDoc />} />
          <Route path="/components/streaming-text" element={<StreamingTextDoc />} />
          <Route path="/components/prompt-input" element={<PromptInputDoc />} />
          <Route path="/components/tool-call" element={<ToolCallDoc />} />
          <Route path="/components/citation" element={<CitationDoc />} />
          <Route path="/components/agent-avatar" element={<AgentAvatarDoc />} />
          <Route path="/components/token-counter" element={<TokenCounterDoc />} />
          <Route path="/components/suggestion-chips" element={<SuggestionChipsDoc />} />
          <Route path="/components/thinking-indicator" element={<ThinkingIndicatorDoc />} />
          <Route path="/components/diff-viewer" element={<DiffViewerDoc />} />
          <Route path="/components/color-picker" element={<ColorPickerDoc />} />
          <Route path="/components/color-input" element={<ColorInputDoc />} />
          <Route path="/components/color-swatch" element={<ColorSwatchDoc />} />
          <Route path="/components/contrast-checker" element={<ContrastCheckerDoc />} />
          <Route path="/components/gradient-builder" element={<GradientBuilderDoc />} />
          <Route path="/components/shadow-builder" element={<ShadowBuilderDoc />} />
          <Route path="/components/linked-list" element={<LinkedListDoc />} />
          <Route path="/components/dsa-stack" element={<DsaStackDoc />} />
          <Route path="/components/queue" element={<QueueDoc />} />
          <Route path="/components/binary-tree" element={<BinaryTreeDoc />} />
          <Route path="/components/graph" element={<GraphDoc />} />
          <Route path="/docs/charts/sparkline-grid" element={<ChartsSparklineGridDoc />} />
          <Route path="/docs/charts/annotations" element={<ChartsAnnotationsDoc />} />
          <Route path="/docs/charts/brush" element={<ChartsBrushDoc />} />
          <Route path="/docs/charts/live-line" element={<ChartsLiveLineDoc />} />
          <Route path="/docs/charts/comparison" element={<ChartsComparisonDoc />} />
          <Route path="/components/sparkline-grid" element={<Navigate to="/docs/charts/sparkline-grid" replace />} />
          <Route path="/components/annotations-layer" element={<Navigate to="/docs/charts/annotations" replace />} />
          <Route path="/components/brush-chart" element={<Navigate to="/docs/charts/brush" replace />} />
          <Route path="/components/live-line-chart" element={<Navigate to="/docs/charts/live-line" replace />} />
          <Route path="/components/comparison-line-chart" element={<Navigate to="/docs/charts/comparison" replace />} />
          <Route path="/components/marketing-blocks" element={<MarketingBlocksDoc />} />
          <Route path="/components/marketing/:slug" element={<MarketingBlockDoc />} />
          <Route path="/dashboards" element={<DashboardIndex />} />
          <Route path="/dashboards/saas-metrics" element={<SaaSMetricsDashboard />} />
          <Route path="/dashboards/analytics" element={<AnalyticsDashboard />} />
          <Route path="/dashboards/ecommerce-admin" element={<EcommerceAdminDashboard />} />
          <Route path="/dashboards/finance" element={<FinanceDashboard />} />
          <Route path="/dashboards/devops" element={<DevOpsDashboard />} />
          <Route path="/dashboards/project-management" element={<ProjectManagementDashboard />} />
          <Route path="/dashboards/hr" element={<HRDashboard />} />
          <Route path="/dashboards/admin-users" element={<AdminUsersDashboard />} />
          <Route path="/dashboards/settings" element={<SettingsDashboard />} />
          <Route path="/dashboards/inbox" element={<InboxDashboard />} />
          <Route path="/dashboards/crm-pipeline" element={<CRMPipelineDashboard />} />
          <Route path="/dashboards/helpdesk" element={<HelpdeskDashboard />} />
          <Route path="/dashboards/marketing-site" element={<MarketingSiteDashboard />} />
          <Route path="/dashboards/social-scheduler" element={<SocialSchedulerDashboard />} />
          <Route path="/components/dialog" element={<DocsDialog />} />
          <Route path="/components/command" element={<CommandDoc />} />
          <Route path="/components/toast" element={<ToastDoc />} />
          <Route path="/components/progress" element={<ProgressDoc />} />
          <Route path="/components/skeleton" element={<SkeletonDoc />} />
          <Route path="/components/data-grid" element={<DataGridDoc />} />
          <Route path="/components/badge" element={<BadgeDoc />} />
          <Route path="/components/card" element={<CardDoc />} />
          <Route path="/components/select" element={<SelectDoc />} />
          <Route path="/components/checkbox" element={<CheckboxDoc />} />
          <Route path="/components/tabs" element={<TabsDoc />} />
          <Route path="/components/dropdown" element={<DropdownDoc />} />
          <Route path="/components/popover" element={<PopoverDoc />} />
          <Route path="/components/tooltip" element={<TooltipDoc />} />
          <Route path="/components/accordion" element={<AccordionDoc />} />
          <Route path="/components/chip" element={<ChipDoc />} />
          <Route path="/components/avatar" element={<AvatarDoc />} />
          <Route path="/components/separator" element={<SeparatorDoc />} />
          <Route path="/components/textarea" element={<TextareaDoc />} />
          <Route path="/components/radio" element={<RadioDoc />} />
          <Route path="/components/slider" element={<SliderDoc />} />
          <Route path="/components/toggle-group" element={<ToggleGroupDoc />} />
          <Route path="/components/sheet" element={<SheetDoc />} />
          <Route path="/components/alert" element={<AlertDoc />} />
          <Route path="/components/spinner" element={<SpinnerDoc />} />
          <Route path="/components/empty-state" element={<EmptyStateDoc />} />
          <Route path="/components/breadcrumbs" element={<BreadcrumbsDoc />} />
          <Route path="/components/pagination" element={<PaginationDoc />} />
          <Route path="/components/stepper" element={<StepperDoc />} />
          <Route path="/components/layout" element={<LayoutDoc />} />
          <Route path="/components/motion-utilities" element={<MotionUtilitiesDoc />} />
          <Route path="/components/table" element={<TableDoc />} />
          <Route path="/components/navbar" element={<NavbarDoc />} />
          <Route path="/components/sidebar" element={<SidebarDoc />} />
          <Route path="/components/charts" element={<ChartsLibraryDoc />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/charts/catalogue" element={<ChartsCataloguePage />} />
          <Route path="/docs/charts/line" element={<ChartsLineDoc />} />
          <Route path="/docs/charts/area" element={<ChartsAreaDoc />} />
          <Route path="/docs/charts/bar" element={<ChartsBarDoc />} />
          <Route path="/docs/charts/pie-donut" element={<ChartsPieDonutDoc />} />
          <Route path="/docs/charts/scatter" element={<ChartsScatterDoc />} />
          <Route path="/docs/charts/candle" element={<ChartsCandleDoc />} />
          <Route path="/docs/charts/radar" element={<ChartsRadarDoc />} />
          <Route path="/docs/charts/funnel" element={<ChartsFunnelDoc />} />
          <Route path="/docs/charts/waterfall" element={<ChartsWaterfallDoc />} />
          <Route path="/docs/charts/treemap" element={<ChartsTreemapDoc />} />
          <Route path="/docs/charts/sparkline" element={<ChartsSparklineDoc />} />
          <Route path="/docs/charts/gauge" element={<ChartsGaugeDoc />} />
          <Route path="/docs/charts/heatmap" element={<ChartsHeatmapDoc />} />
          <Route path="/docs/charts/bullet" element={<ChartsBulletDoc />} />
          <Route path="/docs/charts/lollipop" element={<ChartsLollipopDoc />} />
          <Route path="/docs/charts/dumbbell" element={<ChartsDumbbellDoc />} />
          <Route path="/docs/charts/slope" element={<ChartsSlopeDoc />} />
          <Route path="/docs/charts/radial-bar" element={<ChartsRadialBarDoc />} />
          <Route path="/docs/charts/parallel-coordinates" element={<ChartsParallelCoordinatesDoc />} />
          <Route path="/docs/charts/sunburst" element={<ChartsSunburstDoc />} />
          <Route path="/docs/charts/dendrogram" element={<ChartsDendrogramDoc />} />
          <Route path="/docs/charts/venn" element={<ChartsVennDoc />} />
          <Route path="/docs/charts/waffle" element={<ChartsWaffleDoc />} />
          <Route path="/docs/charts/marimekko" element={<ChartsMarimekkoDoc />} />
          <Route path="/docs/charts/nightingale" element={<ChartsNightingaleDoc />} />
          <Route path="/docs/charts/histogram" element={<ChartsHistogramDoc />} />
          <Route path="/docs/charts/box-plot" element={<ChartsBoxPlotDoc />} />
          <Route path="/docs/charts/violin" element={<ChartsViolinDoc />} />
          <Route path="/docs/charts/ridgeline" element={<ChartsRidgelineDoc />} />
          <Route path="/docs/charts/beeswarm" element={<ChartsBeeswarmDoc />} />
          <Route path="/docs/charts/population-pyramid" element={<ChartsPopulationPyramidDoc />} />
          <Route path="/docs/charts/stream-graph" element={<ChartsStreamGraphDoc />} />
          <Route path="/docs/charts/bump" element={<ChartsBumpDoc />} />
          <Route path="/docs/charts/gantt" element={<ChartsGanttDoc />} />
          <Route path="/docs/charts/horizon" element={<ChartsHorizonDoc />} />
          <Route path="/docs/charts/sankey" element={<ChartsSankeyDoc />} />
          <Route path="/docs/charts/chord" element={<ChartsChordDoc />} />
          <Route path="/docs/charts/network" element={<ChartsNetworkDoc />} />
          <Route path="/docs/charts/tile-map" element={<ChartsTileMapDoc />} />
          <Route path="/docs/charts/word-cloud" element={<ChartsWordCloudDoc />} />
          <Route path="/motion-utilities" element={<MotionUtilitiesShowcase />} />
          <Route path="/docs/tokens" element={<TokensPage />} />
          <Route path="/accents" element={<Accents />} />
          <Route path="/docs/installation" element={<DocsInstallation />} />
          <Route path="/docs/customization" element={<DocsCustomization />} />
          <Route path="/docs/usage" element={<Usage />} />
          <Route path="/docs/motion" element={<DocsMotion />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
          {import.meta.env.DEV && Playground && (
            <Route path="/playground" element={<Playground />} />
          )}
          <Route path="/docs/dialog" element={<Navigate to="/components/dialog" replace />} />
          <Route path="/closeups" element={<Navigate to="/components/button" replace />} />
          <Route path="/feedback" element={<Navigate to="/components/toast" replace />} />
          <Route path="/datagrid" element={<Navigate to="/components/data-grid" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ThemeControls />
    </>
  )
}
