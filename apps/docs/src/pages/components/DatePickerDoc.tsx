import { useState } from 'react'
import { DatePicker, Calendar } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function DatePickerDoc() {
  const [date, setDate] = useState<Date | null>(new Date())
  const [cal, setCal] = useState<Date>(new Date())
  return (
    <ComponentDoc
      slug="date-picker"
      name="DatePicker"
      description="Date selector with a popover calendar. Pass min/max to bound the range; format to customize the trigger text."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <DatePicker value={date} onValueChange={setDate} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            {date ? date.toDateString() : 'no date selected'}
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ DatePicker }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>DatePicker <span className="p">value=</span>{'{'}date{'}'} <span className="p">onValueChange=</span>{'{'}setDate{'}'} <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="calendar" title="Calendar (standalone)">
        <div className="vl-panel" style={{ padding: 20 }}>
          <Calendar selected={cal} onSelect={setCal} />
        </div>
      </Section>
    </ComponentDoc>
  )
}
