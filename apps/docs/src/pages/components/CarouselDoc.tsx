import { Carousel } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

const slides = [
  { title: 'Zero runtime', body: 'CSS does the moving — no animation library.' },
  { title: 'Accessible', body: 'Keyboard nav, ARIA, focus management, reduced motion.' },
  { title: 'Themed', body: 'OKLCH tokens, 7 accents, light + dark modes.' },
]

export default function CarouselDoc() {
  return (
    <ComponentDoc
      slug="carousel"
      name="Carousel"
      description="Slide gallery with arrows, dot indicators, optional autoplay, and loop. Each child is one slide."
      preview={
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Carousel autoPlay autoPlayDelay={4000} loop style={{ background: 'var(--bg-1)' }}>
            {slides.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '48px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'center',
                  textAlign: 'center',
                  background: `linear-gradient(135deg, var(--ac-soft), var(--bg-3))`,
                  minHeight: 180,
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg)' }}>{s.title}</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', maxWidth: 320 }}>{s.body}</div>
              </div>
            ))}
          </Carousel>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Carousel }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Carousel <span className="p">autoPlay</span> <span className="p">loop</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Slide1 <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Slide2 <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Carousel<span className="p">&gt;</span>
        </>
      }
    />
  )
}
