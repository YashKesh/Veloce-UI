import {
  Hero,
  FeatureGrid,
  PricingTable,
  TestimonialWall,
  LogoCloud,
  CTA,
  StatsBar,
  MarketingFooter,
  BentoGrid,
  BentoCell,
  BorderMagic,
  MeteorBackground,
  Sparkles,
  CardTilt,
  TextReveal,
  Button,
} from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function MarketingBlocksDoc() {
  return (
    <ComponentDoc
      slug="marketing-blocks"
      name="Marketing blocks"
      description="Pre-composed landing-page sections and animated primitives. Drop a Hero, pricing table, testimonial wall, or bento grid in minutes — zero-runtime CSS motion throughout."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <Hero
            eyebrow={<><span style={{ padding: '0 6px', borderRadius: 999, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>v1.0</span> Zero-runtime motion, now stable</>}
            title={<>Components that <span style={{ color: 'var(--ac-text)' }}>move</span>.</>}
            description="Accessible React components with signature motion built in. Every transition is pure CSS."
            cta={
              <>
                <BorderMagic>Get started →</BorderMagic>
                <Button variant="outline">Read the docs</Button>
              </>
            }
            foot="No credit card · MIT licensed"
            style={{ padding: '48px 0' }}
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Hero, PricingTable, BentoGrid, BorderMagic }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Hero{'\n'}
          {'  '}title=<span className="s">"Ship fast."</span>{'\n'}
          {'  '}cta={'{'}<span className="p">&lt;</span>BorderMagic<span className="p">&gt;</span>Start<span className="p">&lt;/</span>BorderMagic<span className="p">&gt;</span>{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="feature-grid" title="FeatureGrid">
        <FeatureGrid
          heading="Everything you need."
          intro="Zero-runtime, zero-config, zero-nonsense."
          features={[
            { icon: '⚡', title: 'Instant', description: 'Compiled CSS motion — no animation library on the client.' },
            { icon: '🎨', title: 'Themeable', description: 'OKLCH tokens cascade to every component.' },
            { icon: '♿', title: 'Accessible', description: 'WCAG 2.2 AA, keyboard-first, reduced-motion aware.' },
          ]}
          style={{ padding: '32px 0' }}
        />
      </Section>

      <Section id="bento" title="BentoGrid">
        <BentoGrid>
          <BentoCell colSpan={4} featured title="Fast by default" description="Every component ships with its own motion spec — no Framer, no Motion One.">
            <Sparkles count={30} />
          </BentoCell>
          <BentoCell colSpan={2} title="Themed" description="7 accents × 2 modes.">
            <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
              {['oklch(0.64 0.24 292)', 'oklch(0.8 0.13 205)', 'oklch(0.9 0.21 128)', 'oklch(0.72 0.16 155)', 'oklch(0.83 0.16 70)', 'oklch(0.65 0.22 12)'].map((c, i) => (
                <span key={i} style={{ width: 24, height: 24, borderRadius: 7, background: c }} />
              ))}
            </div>
          </BentoCell>
          <BentoCell colSpan={2} title="Chart library" description="40 types." />
          <BentoCell colSpan={2} title="AI primitives" description="Chat, streaming, tool calls." />
          <BentoCell colSpan={2} title="Zero deps" description="Just React." />
        </BentoGrid>
      </Section>

      <Section id="pricing" title="PricingTable">
        <PricingTable
          tiers={[
            { name: 'Hobby', price: '$0', period: '/mo', description: 'For personal projects.', features: ['Unlimited projects', 'Community support'], cta: <Button variant="outline" style={{ width: '100%' }}>Start free</Button> },
            { name: 'Pro', price: '$20', period: '/mo', description: 'For teams and startups.', features: ['Everything in Hobby', 'Priority support', 'Private registry'], cta: <Button variant="primary" style={{ width: '100%' }}>Upgrade</Button>, featured: true, badge: 'Popular' },
            { name: 'Enterprise', price: 'Custom', description: 'For orgs with scale.', features: ['Everything in Pro', 'SSO + SCIM', 'Dedicated support'], cta: <Button variant="outline" style={{ width: '100%' }}>Contact sales</Button> },
          ]}
          style={{ padding: '32px 0' }}
        />
      </Section>

      <Section id="testimonials" title="TestimonialWall">
        <TestimonialWall
          testimonials={[
            { quote: 'Shipping landing pages went from days to hours. The motion polish is the real unlock.', author: 'Mara Kim', role: 'Design Lead · Acme', avatar: 'MK' },
            { quote: "Finally — a component library that doesn't ship a React animation runtime with it.", author: 'Alex Chen', role: 'Staff Engineer · Linear', avatar: 'AC' },
            { quote: 'The chart coverage alone is unreal. 40 types, all themeable in one line.', author: 'Rina Patel', role: 'CTO · Datadog', avatar: 'RP' },
          ]}
          style={{ padding: '32px 0' }}
        />
      </Section>

      <Section id="logo-cloud" title="LogoCloud (marquee)">
        <LogoCloud
          heading="Trusted by teams at"
          marquee
          logos={['Acme', 'Linear', 'Vercel', 'Notion', 'Figma', 'Stripe', 'Framer', 'Supabase']}
          style={{ padding: '20px 0' }}
        />
      </Section>

      <Section id="stats" title="StatsBar">
        <StatsBar
          stats={[
            { value: '2.4M', label: 'npm downloads', caption: 'last 30 days' },
            { value: '14k', label: 'GitHub stars' },
            { value: '99.99%', label: 'uptime', caption: 'last 12 months' },
            { value: '< 50ms', label: 'build time' },
          ]}
          style={{ padding: '20px 0' }}
        />
      </Section>

      <Section id="animated" title="Animated primitives">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>&lt;BorderMagic&gt;</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <BorderMagic>Get started</BorderMagic>
              <BorderMagic duration={5}>Try the demo</BorderMagic>
            </div>
          </div>
          <div className="vl-panel" style={{ padding: 24, position: 'relative', overflow: 'hidden', minHeight: 160 }}>
            <MeteorBackground count={16} />
            <div style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>&lt;MeteorBackground&gt;</div>
          </div>
          <div className="vl-panel" style={{ padding: 24, position: 'relative', overflow: 'hidden', minHeight: 120 }}>
            <Sparkles count={60} />
            <div style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>&lt;Sparkles&gt;</div>
          </div>
          <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 16 }}>
            <CardTilt style={{ width: 200, height: 140, borderRadius: 12, background: 'linear-gradient(135deg, var(--ac-soft), var(--bg-3))', border: '1px solid var(--line)', padding: 16, color: 'var(--fg)', fontSize: 13.5 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginBottom: 8 }}>Hover me</div>
              CardTilt — 3D cursor-following tilt.
            </CardTilt>
            <CardTilt max={14} style={{ width: 200, height: 140, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--line)', padding: 16, color: 'var(--fg)', fontSize: 13.5 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginBottom: 8 }}>Max tilt 14°</div>
              Pure CSS transforms. No deps.
            </CardTilt>
          </div>
          <div className="vl-panel" style={{ padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginBottom: 10 }}>&lt;TextReveal&gt;</div>
            <TextReveal text="This headline reveals word by word, with a staggered fade and rise, on scroll into view." style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.3 }} />
          </div>
        </div>
      </Section>

      <Section id="cta" title="CTA band">
        <CTA
          eyebrow="Ready to ship?"
          title="Build the next thing in weeks, not quarters."
          description="40 charts, 60 primitives, 10 AI components, 13 marketing blocks. All MIT. All yours."
          actions={
            <>
              <BorderMagic>Install → npm i veloce-ui</BorderMagic>
              <Button variant="outline">Read the docs</Button>
            </>
          }
          style={{ padding: '32px 0' }}
        />
      </Section>

      <Section id="footer" title="MarketingFooter">
        <MarketingFooter
          brand="Veloce UI"
          tagline="Motion-first React components. OKLCH-themed, zero runtime, SSR-safe."
          columns={[
            { title: 'Product', links: [{ label: 'Components' }, { label: 'Charts' }, { label: 'AI' }, { label: 'Blocks' }] },
            { title: 'Resources', links: [{ label: 'Docs' }, { label: 'Customization' }, { label: 'Changelog' }, { label: 'GitHub' }] },
            { title: 'Company', links: [{ label: 'About' }, { label: 'Contact' }] },
          ]}
          copyright="© 2026 Veloce"
          style={{ padding: '32px 24px 20px', marginTop: 20 }}
        />
      </Section>
    </ComponentDoc>
  )
}
