import { type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  Hero, FeatureGrid, PricingTable, TestimonialWall, LogoCloud, CTA,
  StatsBar, MarketingFooter, BentoGrid, BentoCell, BorderMagic,
  MeteorBackground, Sparkles, CardTilt, TextReveal, Button, Badge,
} from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

// =============================================================================
// Per-block doc data — one entry = one page at /components/marketing/<slug>
// =============================================================================

interface BlockDoc {
  slug: string
  name: string
  description: string
  preview: ReactNode
  code: string
  propsRows: PropRow[]
  notes?: ReactNode
}

interface PropRow { name: string; type: string; required?: boolean; description: string }

const sampleFeatures = [
  { icon: <span>⚡</span>, title: 'Fast by default', description: 'Edge-rendered everywhere, 60s cold starts.' },
  { icon: <span>🔒</span>, title: 'Secure by design', description: 'SOC-2, SSO, SCIM on every plan.' },
  { icon: <span>🧩</span>, title: 'Open APIs',       description: 'Every UI call is a documented API.' },
]
const sampleTestimonials = [
  { quote: 'Replaced three internal tools in a sprint.', author: 'Ada Lovelace', role: 'VP Eng, Acme' },
  { quote: 'My team deploys 20× a day now.',             author: 'Alan Turing',  role: 'CTO, Umbrella' },
]
const samplePricing = [
  { name: 'Hobby', price: '$0',  period: '/mo', description: 'For personal projects.', features: ['1 project', '100k requests', 'Community support'],
    cta: <Button variant="ghost" style={{ width: '100%' }}>Get started</Button> },
  { name: 'Pro',   price: '$29', period: '/mo', description: 'For teams building production apps.',
    features: ['Unlimited projects', '10M requests', 'Priority support', 'Preview deploys'],
    cta: <Button variant="primary" style={{ width: '100%' }}>Start trial</Button>, featured: true, badge: <Badge tone="ok" variant="soft">Most popular</Badge> },
]
const sampleStats = [
  { value: '4.2k',   label: 'Deployments / day', caption: 'All regions' },
  { value: '99.99%', label: 'Uptime',            caption: '12-month trailing' },
  { value: '38ms',   label: 'p95 latency',       caption: 'Measured at edge' },
]

// =============================================================================

export const MARKETING_BLOCK_SLUGS = [
  'hero', 'feature-grid', 'bento', 'pricing-table', 'testimonial-wall',
  'logo-cloud', 'stats-bar', 'cta', 'marketing-footer',
  'border-magic', 'meteor-background', 'sparkles', 'card-tilt', 'text-reveal',
] as const

const BLOCKS: Record<string, BlockDoc> = {
  'hero': {
    slug: 'hero', name: 'Hero',
    description: 'Headline section — eyebrow + title + description + CTAs + optional media. Auto-switches between centered and split layouts.',
    preview: (
      <Hero
        eyebrow={<Badge tone="accent" variant="soft">v1.0 — generally available</Badge>}
        title={<>Ship <span style={{ color: 'var(--ac-text)' }}>beautifully</span>, in a weekend.</>}
        description="SaaS tooling that cuts your build time in half. Deploy in 60 seconds, no YAML, no servers to babysit."
        cta={<div style={{ display: 'flex', gap: 10 }}><Button variant="primary">Start free trial</Button><Button variant="ghost">See it in action</Button></div>}
        foot={<span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>No credit card · 14-day trial</span>}
      />
    ),
    code: `import { Hero, Button, Badge } from 'veloce-ui'

<Hero
  eyebrow={<Badge tone="accent" variant="soft">v1.0 — generally available</Badge>}
  title={<>Ship <span style={{ color: 'var(--ac-text)' }}>beautifully</span>, in a weekend.</>}
  description="SaaS tooling that cuts your build time in half."
  cta={<>
    <Button variant="primary">Start free trial</Button>
    <Button variant="ghost">See it in action</Button>
  </>}
  foot="No credit card · 14-day trial"
/>`,
    propsRows: [
      { name: 'title',       type: 'ReactNode', required: true, description: 'Main headline. Use ReactNode to style portions.' },
      { name: 'eyebrow',     type: 'ReactNode', description: 'Small pill or label above the title (e.g. version badge).' },
      { name: 'description', type: 'ReactNode', description: 'Lead paragraph below the title.' },
      { name: 'cta',         type: 'ReactNode', description: 'Buttons or links row.' },
      { name: 'foot',        type: 'ReactNode', description: 'Fine-print line below the CTAs ("No credit card…").' },
      { name: 'media',       type: 'ReactNode', description: 'Optional right-hand media. Triggers split layout automatically.' },
    ],
    notes: <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-2)' }}>Passing <code>media</code> switches to a 2-column split; omit it for a centered hero.</p>,
  },

  'feature-grid': {
    slug: 'feature-grid', name: 'FeatureGrid',
    description: 'Icon tiles with title + short description. 2, 3, or 4 columns, responsive by default.',
    preview: (
      <FeatureGrid
        heading="Everything you need, nothing you don't"
        intro="Built for teams that ship."
        columns={3}
        features={sampleFeatures}
      />
    ),
    code: `import { FeatureGrid } from 'veloce-ui'

<FeatureGrid
  heading="Everything you need, nothing you don't"
  intro="Built for teams that ship."
  columns={3}
  features={[
    { icon: <IconBolt />,  title: 'Fast by default', description: 'Edge-rendered everywhere.' },
    { icon: <IconLock />,  title: 'Secure by design', description: 'SOC-2, SSO on every plan.' },
    { icon: <IconApi />,   title: 'Open APIs',       description: 'Every UI call is documented.' },
  ]}
/>`,
    propsRows: [
      { name: 'features', type: 'Feature[]', required: true, description: 'Array of { icon, title, description, href }.' },
      { name: 'heading',  type: 'ReactNode', description: 'Section headline above the grid.' },
      { name: 'intro',    type: 'ReactNode', description: 'Subheading line.' },
      { name: 'columns',  type: '2 | 3 | 4', description: 'Columns on desktop. Default 3.' },
    ],
  },

  'bento': {
    slug: 'bento', name: 'BentoGrid',
    description: 'Asymmetric grid of cells of varying size — the "bento" layout popularised by Apple-style landing pages.',
    preview: (
      <BentoGrid style={{ width: '100%', maxWidth: 720 }}>
        <BentoCell title="Instant deploys" description="60-second cold starts, every region." colSpan={2}>
          <div style={{ height: 80, borderRadius: 8, background: 'color-mix(in oklch, var(--ac) 15%, transparent)' }} />
        </BentoCell>
        <BentoCell title="Open APIs"      description="Everything is scriptable." />
        <BentoCell title="SOC-2 ready"    description="On every plan." />
        <BentoCell title="Preview URLs"   description="Share a working build with one link." colSpan={2} />
      </BentoGrid>
    ),
    code: `import { BentoGrid, BentoCell } from 'veloce-ui'

<BentoGrid>
  <BentoCell title="Instant deploys" description="60-second cold starts." colSpan={2}>
    <YourVisual />
  </BentoCell>
  <BentoCell title="Open APIs"      description="Everything is scriptable." />
  <BentoCell title="SOC-2 ready"    description="On every plan." />
  <BentoCell title="Preview URLs"   description="Share with one link." colSpan={2} />
</BentoGrid>`,
    propsRows: [
      { name: 'children', type: 'ReactNode', required: true, description: 'BentoCell children.' },
      { name: 'columns',  type: 'number',    description: 'Grid column count. Default 3.' },
    ],
    notes: <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-2)' }}>BentoCell takes <code>colSpan</code> and <code>rowSpan</code> to control which cells are large.</p>,
  },

  'pricing-table': {
    slug: 'pricing-table', name: 'PricingTable',
    description: '2–4 pricing tiers with a highlighted recommendation. Features list and CTA per tier.',
    preview: <PricingTable heading="Pricing" tiers={samplePricing} />,
    code: `import { PricingTable, Button, Badge } from 'veloce-ui'

<PricingTable
  heading="Pricing"
  tiers={[
    {
      name: 'Hobby', price: '$0', period: '/mo',
      description: 'For personal projects.',
      features: ['1 project', '100k requests', 'Community support'],
      cta: <Button variant="ghost" style={{ width: '100%' }}>Get started</Button>,
    },
    {
      name: 'Pro', price: '$29', period: '/mo',
      description: 'For production teams.',
      features: ['Unlimited projects', '10M requests', 'Priority support'],
      cta: <Button variant="primary" style={{ width: '100%' }}>Start trial</Button>,
      featured: true,
      badge: <Badge tone="ok" variant="soft">Most popular</Badge>,
    },
  ]}
/>`,
    propsRows: [
      { name: 'tiers',   type: 'PricingTier[]', required: true, description: 'Each: { name, price, period?, description?, features, cta?, featured?, badge? }.' },
      { name: 'heading', type: 'ReactNode',     description: 'Section headline.' },
      { name: 'intro',   type: 'ReactNode',     description: 'Subheading.' },
    ],
  },

  'testimonial-wall': {
    slug: 'testimonial-wall', name: 'TestimonialWall',
    description: 'Grid of quote cards — social proof section.',
    preview: <TestimonialWall heading="Loved by builders" columns={2} testimonials={sampleTestimonials} />,
    code: `import { TestimonialWall } from 'veloce-ui'

<TestimonialWall
  heading="Loved by builders"
  columns={3}
  testimonials={[
    { quote: 'Replaced three internal tools in a sprint.', author: 'Ada Lovelace', role: 'VP Eng, Acme' },
    { quote: 'My team deploys 20× a day now.',             author: 'Alan Turing',  role: 'CTO, Umbrella' },
  ]}
/>`,
    propsRows: [
      { name: 'testimonials', type: 'Testimonial[]', required: true, description: 'Each: { quote, author, role?, avatar? }.' },
      { name: 'columns',      type: '2 | 3',         description: 'Columns on desktop. Default 3.' },
      { name: 'heading',      type: 'ReactNode',     description: 'Section headline.' },
      { name: 'intro',        type: 'ReactNode',     description: 'Subheading.' },
    ],
  },

  'logo-cloud': {
    slug: 'logo-cloud', name: 'LogoCloud',
    description: 'Row of partner / customer logos. Static grid or auto-scrolling marquee.',
    preview: (
      <LogoCloud
        heading="Trusted by teams at"
        marquee
        logos={['Linear', 'Vercel', 'Supabase', 'Resend', 'Clerk', 'Loom'].map((n) => (
          <span key={n} style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg-3)' }}>{n}</span>
        ))}
      />
    ),
    code: `import { LogoCloud } from 'veloce-ui'

<LogoCloud
  heading="Trusted by teams at"
  marquee  // optional — enable continuous scroll
  logos={brands.map((b) => <img key={b.name} src={b.src} alt={b.name} />)}
/>`,
    propsRows: [
      { name: 'logos',   type: 'ReactNode[]', required: true, description: 'The logo elements (images or styled text).' },
      { name: 'heading', type: 'ReactNode',   description: 'Line above the logos.' },
      { name: 'marquee', type: 'boolean',     description: 'Auto-scroll horizontally. Default false.' },
      { name: 'speed',   type: 'number',      description: 'Marquee speed in seconds. Default 40.' },
    ],
  },

  'stats-bar': {
    slug: 'stats-bar', name: 'StatsBar',
    description: 'Row of large numbers with labels and optional captions.',
    preview: <StatsBar stats={sampleStats} />,
    code: `import { StatsBar } from 'veloce-ui'

<StatsBar
  stats={[
    { value: '4.2k',   label: 'Deployments / day', caption: 'All regions' },
    { value: '99.99%', label: 'Uptime',            caption: '12-month trailing' },
    { value: '38ms',   label: 'p95 latency',       caption: 'Measured at edge' },
  ]}
/>`,
    propsRows: [
      { name: 'stats', type: 'Stat[]', required: true, description: 'Each: { value, label, caption? }.' },
    ],
  },

  'cta': {
    slug: 'cta', name: 'CTA',
    description: 'End-of-page call-to-action band — "ready to ship?" style section.',
    preview: (
      <CTA
        eyebrow="Ready?"
        title="Start shipping in minutes."
        description="Install the CLI, log in, and deploy your first app with one command."
        actions={<div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}><Button variant="primary">Deploy for free</Button><Button variant="ghost">Read the docs →</Button></div>}
      />
    ),
    code: `import { CTA, Button } from 'veloce-ui'

<CTA
  eyebrow="Ready?"
  title="Start shipping in minutes."
  description="Install the CLI, log in, and deploy with one command."
  actions={<>
    <Button variant="primary">Deploy for free</Button>
    <Button variant="ghost">Read the docs →</Button>
  </>}
/>`,
    propsRows: [
      { name: 'title',       type: 'ReactNode', required: true, description: 'Headline.' },
      { name: 'eyebrow',     type: 'ReactNode', description: 'Pill or small label above the title.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting line.' },
      { name: 'actions',     type: 'ReactNode', description: 'Buttons row.' },
    ],
  },

  'marketing-footer': {
    slug: 'marketing-footer', name: 'MarketingFooter',
    description: 'Multi-column site footer with brand, tagline, link columns, and social row.',
    preview: (
      <MarketingFooter
        brand="Veloce"
        tagline="Ship beautifully."
        columns={[
          { title: 'Product', links: [{ label: 'Features' }, { label: 'Pricing' }, { label: 'Docs' }] },
          { title: 'Company', links: [{ label: 'About' }, { label: 'Blog' }, { label: 'Careers' }] },
          { title: 'Legal',   links: [{ label: 'Terms' }, { label: 'Privacy' }] },
        ]}
        copyright="© 2026 Veloce Inc."
      />
    ),
    code: `import { MarketingFooter } from 'veloce-ui'

<MarketingFooter
  brand="Veloce"
  tagline="Ship beautifully."
  columns={[
    { title: 'Product', links: [{ label: 'Features', href: '/features' }, { label: 'Pricing', href: '/pricing' }] },
    { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Blog', href: '/blog' }] },
    { title: 'Legal',   links: [{ label: 'Terms', href: '/terms' }, { label: 'Privacy', href: '/privacy' }] },
  ]}
  copyright="© 2026 Veloce Inc."
/>`,
    propsRows: [
      { name: 'brand',     type: 'ReactNode',       description: 'Brand name or logo.' },
      { name: 'tagline',   type: 'ReactNode',       description: 'One-line brand descriptor.' },
      { name: 'columns',   type: 'FooterColumn[]',  required: true, description: 'Each: { title, links: [{ label, href? }] }.' },
      { name: 'social',    type: 'ReactNode',       description: 'Social-media links row.' },
      { name: 'copyright', type: 'ReactNode',       description: 'Bottom copyright line.' },
    ],
  },

  'border-magic': {
    slug: 'border-magic', name: 'BorderMagic',
    description: 'Button with an animated gradient border that circles the edge. Pure CSS, zero-runtime.',
    preview: <div style={{ display: 'flex', gap: 12 }}><BorderMagic>Deploy to production</BorderMagic><BorderMagic duration={5}>Slower orbit</BorderMagic></div>,
    code: `import { BorderMagic } from 'veloce-ui'

<BorderMagic onClick={deploy}>Deploy to production</BorderMagic>
<BorderMagic duration={5}>Slower orbit</BorderMagic>`,
    propsRows: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Button label.' },
      { name: 'duration', type: 'number', description: 'Orbit duration in seconds. Default 3.' },
      { name: 'onClick',  type: '() => void', description: 'Standard click handler.' },
    ],
  },

  'meteor-background': {
    slug: 'meteor-background', name: 'MeteorBackground',
    description: 'Decorative background that spawns falling light streaks across any container.',
    preview: (
      <div style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
        <MeteorBackground count={14} />
        <div style={{ position: 'relative', zIndex: 1, padding: 24, color: 'var(--fg)', fontSize: 20, fontWeight: 600 }}>Hero background</div>
      </div>
    ),
    code: `import { MeteorBackground } from 'veloce-ui'

<div style={{ position: 'relative', overflow: 'hidden' }}>
  <MeteorBackground count={20} />
  <YourHeroContent />
</div>`,
    propsRows: [
      { name: 'count', type: 'number', description: 'Number of streaks. Default 20.' },
    ],
    notes: <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-2)' }}>The container needs <code>position: relative</code> and <code>overflow: hidden</code>.</p>,
  },

  'sparkles': {
    slug: 'sparkles', name: 'Sparkles',
    description: 'Twinkling particle overlay — adds subtle magic over any background or hero section.',
    preview: (
      <div style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
        <Sparkles count={40} />
        <div style={{ position: 'relative', zIndex: 1, padding: 24, color: 'var(--fg)', fontSize: 20, fontWeight: 600 }}>With sparkles</div>
      </div>
    ),
    code: `import { Sparkles } from 'veloce-ui'

<div style={{ position: 'relative' }}>
  <Sparkles count={40} />
  <YourContent />
</div>`,
    propsRows: [
      { name: 'count', type: 'number', description: 'Number of particles. Default 40.' },
      { name: 'color', type: 'string', description: 'Particle colour. Default var(--ac).' },
    ],
  },

  'card-tilt': {
    slug: 'card-tilt', name: 'CardTilt',
    description: 'Interactive card that tilts in 3D on cursor move. Pure CSS perspective + transform.',
    preview: (
      <CardTilt style={{ padding: 24, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)', width: 240 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Interactive card</div>
        <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 6 }}>Move your cursor across this card.</div>
      </CardTilt>
    ),
    code: `import { CardTilt } from 'veloce-ui'

<CardTilt style={{ padding: 24, borderRadius: 12 }}>
  <YourCardContent />
</CardTilt>`,
    propsRows: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Card content.' },
      { name: 'intensity', type: 'number', description: 'Tilt range in degrees. Default 10.' },
    ],
  },

  'text-reveal': {
    slug: 'text-reveal', name: 'TextReveal',
    description: 'Reveals text word-by-word as the element scrolls into view.',
    preview: (
      <TextReveal
        text="Ship beautifully. Deploy in a weekend."
        style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, color: 'var(--fg)' }}
      />
    ),
    code: `import { TextReveal } from 'veloce-ui'

<TextReveal
  text="Ship beautifully. Deploy in a weekend."
  style={{ fontSize: 32, fontWeight: 600 }}
/>`,
    propsRows: [
      { name: 'text',    type: 'string',  required: true, description: 'Text to reveal. Each word animates independently.' },
      { name: 'stagger', type: 'number',  description: 'Milliseconds between words. Default 60.' },
      { name: 'onView',  type: 'boolean', description: 'Only trigger when scrolled into view. Default true.' },
    ],
  },
}

// =============================================================================
// Generic doc renderer
// =============================================================================

export default function MarketingBlockDoc() {
  const { slug } = useParams<{ slug: string }>()
  const block = slug ? BLOCKS[slug] : undefined
  if (!block) return <Navigate to="/components/marketing-blocks" replace />

  return (
    <ComponentDoc
      slug={`marketing-${block.slug}`}
      name={block.name}
      description={block.description}
      preview={<div style={{ width: '100%' }}>{block.preview}</div>}
      usage={block.code}
      toc={[
        { label: 'Live example', id: 'preview', active: true },
        { label: 'Usage', id: 'usage' },
        ...(block.notes ? [{ label: 'Notes', id: 'notes' }] : []),
        { label: 'API', id: 'api' },
        { label: 'More blocks', id: 'more' },
      ]}
    >
      {block.notes && (
        <Section id="notes" title="Notes">
          {block.notes}
        </Section>
      )}

      <Section id="api" title="API">
        <div style={{ overflow: 'auto', border: '1px solid var(--line)', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)' }}>
                <th style={thStyle}>Prop</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {block.propsRows.map((p) => (
                <tr key={p.name} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={tdStyle}>
                    <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ac-text)' }}>{p.name}</code>
                    {p.required && <span style={{ color: 'var(--err)', marginLeft: 4 }}>*</span>}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>{p.type}</td>
                  <td style={{ ...tdStyle, color: 'var(--fg-2)' }}>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="more" title="More marketing blocks">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {MARKETING_BLOCK_SLUGS.filter((s) => s !== block.slug).map((s) => {
            const b = BLOCKS[s]
            return (
              <a key={s} href={`/components/marketing/${s}`} style={{
                padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 8,
                background: 'var(--bg-1)', color: 'var(--fg)', textDecoration: 'none',
                fontSize: 13, fontWeight: 500,
              }}>{b.name}</a>
            )
          })}
        </div>
      </Section>
    </ComponentDoc>
  )
}

const thStyle = { padding: '10px 14px', textAlign: 'left' as const, fontSize: 11.5, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const tdStyle = { padding: '10px 14px', verticalAlign: 'top' as const, lineHeight: 1.5 }
