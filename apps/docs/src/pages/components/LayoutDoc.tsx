import { Container, Grid, Stack, AspectRatio } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'The four primitives', id: 'primitives' },
]

const cell = { background: 'var(--bg-3)', borderRadius: 6, padding: 10, fontSize: 12, color: 'var(--fg-2)', textAlign: 'center' as const }

export default function LayoutDoc() {
  return (
    <ComponentDoc
      slug="layout"
      name="Layout primitives"
      description="Zero-runtime layout components — they compile to flex and grid, no motion, no JS."
      toc={TOC}
      preview={
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>Container (maxWidth=320)</span>
            <Container maxWidth={320} padX={0}>
              <div style={cell}>Centered content</div>
            </Container>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>Grid (cols=3)</span>
            <Grid cols={3} gap={8}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => <div key={l} style={cell}>{l}</div>)}
            </Grid>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>Stack (gap=10)</span>
            <Stack gap={10}>
              <div style={cell}>Row 1</div>
              <div style={cell}>Row 2</div>
              <div style={cell}>Row 3</div>
            </Stack>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>AspectRatio (16/9)</span>
            <AspectRatio ratio={16 / 9} style={{ background: 'var(--bg-3)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              16 / 9
            </AspectRatio>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Container, Grid, Stack, AspectRatio }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Container <span className="p">maxWidth=</span>{'{'}720{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Grid <span className="p">cols=</span>{'{'}3{'}'} <span className="p">gap=</span>{'{'}16{'}'}<span className="p">&gt;</span>…<span className="p">&lt;/</span>Grid<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Container<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="primitives" title="The four primitives">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: 'var(--fg-2)' }}>
          {[
            ['Container', 'Centres content with a max-width cap. Set padX for horizontal gutters.'],
            ['Grid', 'Equal-width columns. Set cols=N or minItemWidth for responsive auto-fit.'],
            ['Stack', 'Vertical/horizontal flex stack with a single gap token.'],
            ['AspectRatio', 'Locks a child to a width/height ratio — ideal for media, charts, embeds.'],
          ].map(([name, desc]) => (
            <div key={name} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)', minWidth: 100 }}>{name}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentDoc>
  )
}
