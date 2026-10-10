import { Blockquote } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function BlockquoteDoc() {
  return (
    <ComponentDoc
      slug="blockquote"
      name="Blockquote"
      description="Semantic <blockquote> with a left accent rule. Pass cite for an optional source attribution."
      preview={
        <Blockquote cite="Dieter Rams" style={{ maxWidth: 520 }}>
          Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects.
        </Blockquote>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Blockquote }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Blockquote <span className="p">cite=</span><span className="s">"Rams"</span><span className="p">&gt;</span>{'\n'}
          {'  '}Good design is as little design as possible.{'\n'}
          <span className="p">&lt;/</span>Blockquote<span className="p">&gt;</span>
        </>
      }
    />
  )
}
