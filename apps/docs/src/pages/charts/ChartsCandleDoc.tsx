import ChartDocPage from './ChartDocPage'
import { CHART_PAGES } from './chartsData'

export default function ChartsCandleDoc() {
  return <ChartDocPage page={CHART_PAGES['candle']} />
}
