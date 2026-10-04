import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Collapsing', id: 'collapsing' },
]

function Crumb({ label }: { label: string }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href="#preview"
      onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ color: hover ? 'var(--fg)' : 'var(--fg-2)', fontSize: 13.5 }}
    >
      {label}
    </a>
  )
}

function Sep() {
  return <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>/</span>
}

export default function BreadcrumbsDoc() {
  return (
    <ComponentDoc
      slug="breadcrumbs"
      name="Breadcrumbs"
      description="A location trail with no motion — navigation should feel instant, not choreographed."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 320 }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Crumb label="Dashboard" />
            <Sep />
            <Crumb label="Projects" />
            <Sep />
            <Crumb label="veloce-ui" />
            <Sep />
            <span style={{ color: 'var(--fg)', fontSize: 13.5, fontWeight: 500 }}>Settings</span>
          </nav>
          <nav aria-label="Breadcrumb collapsed" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Crumb label="Dashboard" />
            <Sep />
            <button
              type="button"
              aria-label="Show hidden items"
              style={{
                borderRadius: 5, border: 'none',
                background: 'var(--bg-3)', color: 'var(--fg-3)', fontSize: 12,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: '2px 7px', lineHeight: 1,
              }}
            >
              …
            </button>
            <Sep />
            <span style={{ color: 'var(--fg)', fontSize: 13.5, fontWeight: 500 }}>Settings</span>
          </nav>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Breadcrumbs }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Breadcrumbs{'\n'}
          {'  '}<span className="p">maxItems=</span>{'{4}'}{'\n'}
          {'  '}<span className="p">items=</span>{'{['}{'\n'}
          {'    '}{'{ '}label: <span className="s">"Dashboard"</span>, href: <span className="s">"/"</span>{' }'},{'\n'}
          {'    '}{'{ '}label: <span className="s">"Projects"</span>, href: <span className="s">"/projects"</span>{' }'},{'\n'}
          {'    '}{'{ '}label: <span className="s">"Settings"</span>{' }'},{'\n'}
          {'  ]}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="collapsing" title="Collapsing">
        <div className="vl-panel" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-2)' }}>
            maxItems={'{4}'} → first + … + last two
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-3)', margin: 0 }}>
            When the trail exceeds <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>maxItems</code>,
            the first item and the last two are always kept; everything in between collapses into
            a single … button. Clicking it expands the hidden items in place — instantly, with no
            animation.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
