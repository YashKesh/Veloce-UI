import { Hero, FeatureGrid, StatsBar, LogoCloud, TestimonialWall, PricingTable, CTA, MarketingFooter, Button, Badge } from 'veloce-ui'
import { DashboardShell } from './DashboardShell'

export default function MarketingSite() {
  return (
    <DashboardShell slug="marketing-site" title="Marketing · Landing" description="Full marketing landing page template — Hero, Features, Stats, Logos, Testimonials, Pricing, CTA, Footer.">
      <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)' }}>
        <Hero
          eyebrow={<Badge tone="accent" variant="soft">v1.0 — now generally available</Badge>}
          title={<>Ship <span style={{ color: 'var(--ac-text)' }}>beautifully</span>, in a weekend.</>}
          description="SaaS tooling that cuts your build time in half. Deploy in 60 seconds, no YAML, no servers to babysit, no weekend pages."
          cta={
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="primary">Start free trial</Button>
              <Button variant="ghost">See it in action</Button>
            </div>
          }
          foot={<span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>No credit card · 14-day trial · Cancel anytime</span>}
          media={<HeroMedia />}
        />

        <LogoCloud
          heading="Trusted by teams at"
          logos={['Linear', 'Vercel', 'Supabase', 'Resend', 'Clerk', 'Loom', 'Turso', 'PlanetScale'].map((n) => (
            <span key={n} style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg-3)' }}>{n}</span>
          ))}
        />

        <StatsBar
          stats={[
            { value: '4.2k', label: 'Deployments / day', caption: 'Across every region' },
            { value: '99.99%', label: 'Uptime', caption: '12-month trailing' },
            { value: '38ms', label: 'p95 latency', caption: 'Measured at edge' },
            { value: '14', label: 'Regions', caption: '6 continents' },
          ]}
        />

        <FeatureGrid
          heading="Everything you need, nothing you don't"
          intro="Built from the ground up for teams that ship. No gatekeeping, no boilerplate."
          columns={3}
          features={[
            { icon: <span style={{ fontSize: 22 }}>⚡</span>, title: 'Fast by default', description: 'Edge-rendered everywhere, 60s cold starts, zero config.' },
            { icon: <span style={{ fontSize: 22 }}>🔒</span>, title: 'Secure by design', description: 'SOC-2, SSO, SCIM, audit log — on every plan, not an upsell.' },
            { icon: <span style={{ fontSize: 22 }}>🧩</span>, title: 'Open APIs', description: 'Everything you see in the UI is a documented API call.' },
            { icon: <span style={{ fontSize: 22 }}>📈</span>, title: 'Scales with you', description: 'From a weekend hack to 10M requests — same price per unit.' },
            { icon: <span style={{ fontSize: 22 }}>🎨</span>, title: 'White-label ready', description: 'Fully brandable. Theme every surface in minutes.' },
            { icon: <span style={{ fontSize: 22 }}>🤝</span>, title: 'Human support', description: 'Real engineers reply in under 2 hours, including weekends.' },
          ]}
        />

        <TestimonialWall
          heading="Loved by builders"
          columns={3}
          testimonials={[
            { quote: 'Replaced three internal tools in one sprint. Not an exaggeration.', author: 'Ada Lovelace', role: 'VP Eng, Acme' },
            { quote: 'My team deploys 20× a day now. The DX is unreal.', author: 'Alan Turing', role: 'CTO, Umbrella' },
            { quote: 'Honestly, this is what AWS wishes it was.', author: 'Grace Hopper', role: 'Staff Eng, Globex' },
            { quote: 'Shipped our v1 in 48 hours with Veloce. Launched the next day.', author: 'Linus Torvalds', role: 'Founder, Soylent' },
            { quote: 'The pricing is honest. The product is better. What else do you need?', author: 'Margaret Hamilton', role: 'Head of Platform, Initech' },
            { quote: 'Finally, a tool that doesn\'t make me feel stupid for using it.', author: 'Ken Thompson', role: 'Principal, Wonka' },
          ]}
        />

        <PricingTable
          heading="Pricing that scales with you"
          intro="Start free. Upgrade when you outgrow it."
          tiers={[
            {
              name: 'Hobby',
              price: '$0',
              period: '/mo',
              description: 'For personal projects and prototypes.',
              features: ['1 project', '100k requests / mo', 'Community support', 'Custom domain'],
              cta: <Button variant="ghost" style={{ width: '100%' }}>Get started</Button>,
            },
            {
              name: 'Pro',
              price: '$29',
              period: '/mo',
              description: 'For teams building production apps.',
              features: ['Unlimited projects', '10M requests / mo', 'Priority support', 'Preview deploys', 'Analytics', 'Audit log'],
              cta: <Button variant="primary" style={{ width: '100%' }}>Start trial</Button>,
              featured: true,
              badge: <Badge tone="ok" variant="soft">Most popular</Badge>,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'For large teams with custom needs.',
              features: ['Everything in Pro', 'SSO + SCIM', 'SLA 99.99%', 'Dedicated support', 'Private cloud option', 'Invoice billing'],
              cta: <Button variant="ghost" style={{ width: '100%' }}>Contact sales</Button>,
            },
          ]}
        />

        <CTA
          eyebrow="Ready?"
          title="Start shipping in minutes."
          description="Install the CLI, log in, and deploy your first app with one command."
          actions={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="primary">Deploy for free</Button>
              <Button variant="ghost">Read the docs →</Button>
            </div>
          }
        />

        <MarketingFooter
          brand="Veloce"
          tagline="Ship beautifully."
          columns={[
            { title: 'Product', links: [{ label: 'Features' }, { label: 'Pricing' }, { label: 'Changelog' }, { label: 'Docs' }] },
            { title: 'Company', links: [{ label: 'About' }, { label: 'Blog' }, { label: 'Careers' }, { label: 'Press' }] },
            { title: 'Legal', links: [{ label: 'Terms' }, { label: 'Privacy' }, { label: 'Security' }] },
          ]}
          copyright="© 2026 Veloce Inc."
          social={<>
            <a href="#" style={{ color: 'var(--fg-3)', fontSize: 13 }}>GitHub</a>
            <a href="#" style={{ color: 'var(--fg-3)', fontSize: 13, marginLeft: 12 }}>X</a>
            <a href="#" style={{ color: 'var(--fg-3)', fontSize: 13, marginLeft: 12 }}>Discord</a>
          </>}
        />
      </div>
    </DashboardShell>
  )
}

function HeroMedia() {
  return (
    <div style={{ position: 'relative', borderRadius: 14, border: '1px solid var(--line)', background: 'var(--bg)', aspectRatio: '16/10', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      {/* fake dashboard preview */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', padding: 10, gap: 6 }}>
        {['#ff5f57', '#ffbd2e', '#28c940'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.6 }} />)}
      </div>
      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-1)' }}>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{['MRR', 'Users', 'Latency', 'Errors'][i]}</div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4, color: 'var(--fg)' }}>{['$142k', '8.4k', '38ms', '0.02%'][i]}</div>
            <div style={{ fontSize: 11, color: 'var(--ok)', marginTop: 2 }}>↑ {['12', '3', '8', '1'][i]}%</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '0 20px 20px', padding: 14, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-1)', height: 100 }}>
        <svg viewBox="0 0 300 70" width="100%" height="100%">
          <path d="M 0 55 L 30 45 L 60 48 L 90 32 L 120 36 L 150 25 L 180 28 L 210 15 L 240 18 L 270 8 L 300 12" fill="none" stroke="var(--ac)" strokeWidth="2" />
          <path d="M 0 55 L 30 45 L 60 48 L 90 32 L 120 36 L 150 25 L 180 28 L 210 15 L 240 18 L 270 8 L 300 12 L 300 70 L 0 70 Z" fill="var(--ac)" opacity="0.1" />
        </svg>
      </div>
    </div>
  )
}
