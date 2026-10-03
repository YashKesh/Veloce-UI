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
const DocsDialog = lazy(() => import('./pages/DocsDialog'))
const Gallery = lazy(() => import('./pages/Gallery'))
const TokensPage = lazy(() => import('./pages/TokensPage'))
const Accents = lazy(() => import('./pages/Accents'))
const DocsInstallation = lazy(() => import('./pages/DocsInstallation'))
const DocsMotion = lazy(() => import('./pages/DocsMotion'))
const ButtonDoc = lazy(() => import('./pages/components/ButtonDoc'))
const InputDoc = lazy(() => import('./pages/components/InputDoc'))
const SwitchDoc = lazy(() => import('./pages/components/SwitchDoc'))
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
          <Route path="/components" element={<Gallery />} />
          <Route path="/components/button" element={<ButtonDoc />} />
          <Route path="/components/input" element={<InputDoc />} />
          <Route path="/components/switch" element={<SwitchDoc />} />
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
          <Route path="/motion-utilities" element={<MotionUtilitiesShowcase />} />
          <Route path="/docs/tokens" element={<TokensPage />} />
          <Route path="/accents" element={<Accents />} />
          <Route path="/docs/installation" element={<DocsInstallation />} />
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
