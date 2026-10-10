import { Breadcrumbs } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Separators', id: 'separators' },
]

export default function BreadcrumbsDoc() {
  return (
    <ComponentDoc
      slug="breadcrumbs"
      name="Breadcrumbs"
      description="A location trail with no motion — navigation should feel instant, not choreographed."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 320 }}>
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'veloce-ui', href: '#' },
              { label: 'Settings' },
            ]}
          />
          <Breadcrumbs
            items={[
              { label: 'Docs', href: '#' },
              { label: 'Components', href: '#' },
              { label: 'Breadcrumbs' },
            ]}
            separator={<span style={{ color: 'var(--fg-3)' }}>›</span>}
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Breadcrumbs }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Breadcrumbs{'\n'}
          {'  '}<span className="p">items=</span>{'{['}{'\n'}
          {'    '}{'{ '}label: <span className="s">"Dashboard"</span>, href: <span className="s">"/"</span>{' }'},{'\n'}
          {'    '}{'{ '}label: <span className="s">"Projects"</span>, href: <span className="s">"/projects"</span>{' }'},{'\n'}
          {'    '}{'{ '}label: <span className="s">"Settings"</span>{' }'},{'\n'}
          {'  ]}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="separators" title="Separators">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Breadcrumbs items={[{ label: 'A', href: '#' }, { label: 'B', href: '#' }, { label: 'C' }]} />
            default (/)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Breadcrumbs items={[{ label: 'A', href: '#' }, { label: 'B', href: '#' }, { label: 'C' }]} separator={<span>›</span>} />
            chevron
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Breadcrumbs items={[{ label: 'A', href: '#' }, { label: 'B', href: '#' }, { label: 'C' }]} separator={<span>•</span>} />
            dot
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
