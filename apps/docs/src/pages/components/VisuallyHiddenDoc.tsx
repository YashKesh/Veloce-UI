import { VisuallyHidden, Button } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function VisuallyHiddenDoc() {
  return (
    <ComponentDoc
      slug="visually-hidden"
      name="VisuallyHidden"
      description="Hides content visually but keeps it available to screen readers. Essential for icon-only buttons that need an accessible name without visible text."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <Button variant="outline">
            <span aria-hidden>⛓</span>
            <VisuallyHidden>Copy link to clipboard</VisuallyHidden>
          </Button>
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Screen reader announces "Copy link to clipboard"</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ VisuallyHidden }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>button<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>IconChain <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>VisuallyHidden<span className="p">&gt;</span>Copy link<span className="p">&lt;/</span>VisuallyHidden<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>button<span className="p">&gt;</span>
        </>
      }
    />
  )
}
