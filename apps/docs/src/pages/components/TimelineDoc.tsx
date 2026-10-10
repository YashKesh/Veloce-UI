import { Timeline } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function TimelineDoc() {
  return (
    <ComponentDoc
      slug="timeline"
      name="Timeline"
      description="Vertical event list with connecting rule. Each item accepts a tone, time, and optional description."
      preview={
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Timeline
            items={[
              { label: 'PR opened', time: '2d ago', tone: 'accent', icon: '✎' },
              { label: 'Build passed', time: '2d ago', description: '14 regions · 42s', tone: 'ok', icon: '✓' },
              { label: 'Review requested', time: '1d ago', description: 'Assigned @mara, @alex', tone: 'default' },
              { label: 'Merged to main', time: '3h ago', description: 'Squashed · auto-deployed', tone: 'ok', icon: '✓' },
              { label: 'Preview deleted', time: 'just now', tone: 'default' },
            ]}
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Timeline }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Timeline{'\n'}
          {'  '}<span className="p">items=</span>{'{'}[{'\n'}
          {'    '}{'{ '}label: <span className="s">"PR opened"</span>, time: <span className="s">"2d ago"</span>{' }'},{'\n'}
          {'  ]}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
