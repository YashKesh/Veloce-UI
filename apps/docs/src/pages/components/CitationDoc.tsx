import { Citation } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function CitationDoc() {
  return (
    <ComponentDoc
      slug="citation"
      name="Citation"
      description="Inline numbered citation badge with a hover-reveal source card. The pattern Perplexity, ChatGPT with browsing, and Claude Projects all use for cited answers."
      preview={
        <div style={{ maxWidth: 540, fontSize: 15, lineHeight: 1.7, color: 'var(--fg)' }}>
          <p>
            OKLCH gives you perceptually uniform color manipulation and better interpolation than HSL
            <Citation
              index={1}
              href="https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl"
              source="evilmartians.com"
              title="OKLCH in CSS: why we moved from RGB and HSL"
              snippet="OKLCH stays perceptually uniform across hue, lightness, chroma — hex gradients don't."
            />
            , which is why most modern design systems ship it as the default color space
            <Citation
              index={2}
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch"
              source="MDN"
              title="oklch() — CSS: Cascading Style Sheets"
              snippet="The oklch() functional notation expresses a given color in the OKlch color space."
            />
            . Browser support reached 95%+ in late 2024
            <Citation
              index={3}
              href="https://caniuse.com/mdn-css_types_color_oklch"
              source="caniuse.com"
              title="OKLCH color notation support"
              snippet="Supported in Chrome 111, Safari 15.4, Firefox 113+."
            />
            .
          </p>
          <p style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 16 }}>
            Hover any citation to see its source.
          </p>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Citation }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Citation index={'{'}1{'}'} href={'{'}url{'}'} title={'{'}title{'}'} snippet={'{'}snippet{'}'} <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
