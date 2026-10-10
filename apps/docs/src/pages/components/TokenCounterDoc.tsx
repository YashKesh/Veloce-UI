import { TokenCounter } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function TokenCounterDoc() {
  return (
    <ComponentDoc
      slug="token-counter"
      name="TokenCounter"
      description="Mini usage pill: tokens / limit · $cost. Color shifts to warn then err as usage approaches the limit."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <TokenCounter tokens={812} limit={200000} />
          <TokenCounter tokens={162_000} limit={200_000} pricePer1k={0.015} />
          <TokenCounter tokens={198_000} limit={200_000} pricePer1k={0.015} />
          <TokenCounter tokens={2_148_391} compact={false} />
          <TokenCounter tokens={450} pricePer1k={0.00025} />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ TokenCounter }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>TokenCounter tokens={'{'}usage{'}'} limit={'{'}200_000{'}'} pricePer1k={'{'}0.015{'}'} <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
