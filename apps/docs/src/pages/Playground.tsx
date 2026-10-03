import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Button,
  Badge,
  Chip,
  Card,
  Avatar,
  Separator,
  Input,
  Textarea,
  Spinner,
  Skeleton,
  Alert,
  Dialog,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Select,
  Slider,
  ToggleGroup,
  Tabs,
  Progress,
  EmptyState,
  Breadcrumbs,
  Pagination,
  Stepper,
  Accordion,
  Tooltip,
  TooltipProvider,
  Popover,
  DropdownMenu,
  LineChart,
  AreaChart,
  BarChart,
  SparklineChart,
  PieChart,
  ScatterChart,
  CandleChart,
  RadarChart,
  FunnelChart,
  WaterfallChart,
  TreemapChart,
  HeatmapChart,
  GaugeChart,
  Table,
  DataGrid,
  type ColumnDef,
} from 'veloce-ui'
import { DocsShell, RightRail, type TocItem } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'

const sectionStyle: CSSProperties = {
  border: '1px solid var(--line)',
  borderRadius: 12,
  padding: 20,
  background: 'var(--bg-1)',
  marginBottom: 20,
}

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontFamily: 'var(--font-mono)',
  color: 'var(--fg-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  display: 'block',
}

const inlineCell: CSSProperties = {
  minWidth: 160,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  fontSize: 13,
}

const chartCell: CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
}

const sectionH2: CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: 'var(--fg)',
  margin: '0 0 14px',
}

function Cell({ label, children, w }: { label: string; children: ReactNode; w?: number | string }) {
  return (
    <div style={{ width: w, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
      <span style={labelStyle}>{label}</span>
      <div>{children}</div>
    </div>
  )
}

const BUTTON_VARIANTS = ['primary', 'ghost', 'outline', 'destructive'] as const
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const
const TONES = ['neutral', 'accent', 'ok', 'warn', 'err'] as const
const CHIP_BADGE_VARIANTS = ['solid', 'soft', 'outline'] as const
const ALERT_TONES = ['info', 'ok', 'warn', 'err'] as const

const IconPlus = () => <span aria-hidden>＋</span>
const IconArrow = () => <span aria-hidden>→</span>

export default function Playground() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [textareaVal, setTextareaVal] = useState('Line one\nLine two\nLine three')
  const [chips, setChips] = useState<string[]>(['React', 'TypeScript', 'OKLCH', 'Vite', 'Motion'])
  const [cb1, setCb1] = useState(false)
  const [cb2, setCb2] = useState(true)
  const [radio, setRadio] = useState('b')
  const [sw, setSw] = useState(true)
  const [selVal, setSelVal] = useState('a')
  const [slider, setSlider] = useState(42)
  const [tgSingle, setTgSingle] = useState('left')
  const [tgMulti, setTgMulti] = useState<string[]>(['bold'])
  const [tabVal, setTabVal] = useState('one')
  const [accVal, setAccVal] = useState('a')
  const [page, setPage] = useState(3)
  const [popOpen, setPopOpen] = useState(false)
  const [ddOpen, setDdOpen] = useState(false)

  const toc: TocItem[] = [
    { label: 'Button', id: 'button' },
    { label: 'Badge', id: 'badge' },
    { label: 'Chip', id: 'chip' },
    { label: 'Card', id: 'card' },
    { label: 'Avatar', id: 'avatar' },
    { label: 'Separator', id: 'separator' },
    { label: 'Input', id: 'input' },
    { label: 'Textarea', id: 'textarea' },
    { label: 'Spinner', id: 'spinner' },
    { label: 'Skeleton', id: 'skeleton' },
    { label: 'Alert', id: 'alert' },
    { label: 'Dialog', id: 'dialog' },
    { label: 'Checkbox', id: 'checkbox' },
    { label: 'Radio', id: 'radio' },
    { label: 'Switch', id: 'switch' },
    { label: 'Select', id: 'select' },
    { label: 'Slider', id: 'slider' },
    { label: 'Toggle group', id: 'toggle-group' },
    { label: 'Tabs', id: 'tabs' },
    { label: 'Progress', id: 'progress' },
    { label: 'Empty state', id: 'empty-state' },
    { label: 'Breadcrumbs', id: 'breadcrumbs' },
    { label: 'Pagination', id: 'pagination' },
    { label: 'Stepper', id: 'stepper' },
    { label: 'Accordion', id: 'accordion' },
    { label: 'Tooltip', id: 'tooltip' },
    { label: 'Popover', id: 'popover' },
    { label: 'Dropdown menu', id: 'dropdown' },
  ]

  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={toc} />} wide>
      {/* HERO */}
      <section style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, fontWeight: 650, letterSpacing: '-0.015em', margin: 0, color: 'var(--fg)' }}>
          Playground
        </h1>
        <p style={{ marginTop: 12, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 760 }}>
          Live render of every primitive from the built <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--fg)' }}>veloce-ui</code> package.
          If you change the library and re-run <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--fg)' }}>npm run build:ui</code>, this page shows the result.
        </p>
        <pre
          style={{
            marginTop: 14,
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            color: 'var(--fg-2)',
            background: 'var(--bg-1)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
{`import { Button, Badge, Chip, Card, Avatar, Separator, Input, Textarea, Spinner, Skeleton, Alert, Dialog } from "veloce-ui"`}
        </pre>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          built: packages/ui/dist/index.js
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <Badge tone="accent" variant="soft">veloce-ui@0.1.0</Badge>
          <Badge tone="neutral" variant="outline">12 primitives</Badge>
        </div>
      </section>

      {/* OVERRIDE DEMO */}
      <section
        id="override-demo"
        style={{
          ...sectionStyle,
          borderStyle: 'dashed',
          borderColor: 'var(--line-2)',
        }}
      >
        <style>{`.demo-override { background: oklch(0.6 0.22 30); color: white; }`}</style>
        <h2 style={sectionH2}>Override demo</h2>
        <p style={{ margin: '0 0 14px', color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.5 }}>
          Three identical <code style={{ fontFamily: 'var(--font-mono)' }}>Button variant="primary"</code> instances. The second is customized via <code style={{ fontFamily: 'var(--font-mono)' }}>style</code>; the third via <code style={{ fontFamily: 'var(--font-mono)' }}>className</code>.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Default</Button>
          <Button variant="primary" style={{ background: 'oklch(0.65 0.2 150)' }}>Via style</Button>
          <Button variant="primary" className="demo-override">Via className</Button>
        </div>
        <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--fg-3)', lineHeight: 1.5 }}>
          The library's CSS lives in <code style={{ fontFamily: 'var(--font-mono)' }}>@layer veloce-ui</code>; any un-layered user CSS beats it without <code style={{ fontFamily: 'var(--font-mono)' }}>!important</code>.
        </div>
      </section>

      {/* BUTTON */}
      <section id="button" style={sectionStyle}>
        <h2 style={sectionH2}>Button</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            marginBottom: 20,
            background: 'oklch(0.18 0.01 260)',
            borderRadius: 10,
            border: '1px solid var(--line)',
          }}
        >
          <span style={{ ...labelStyle, marginBottom: 0, color: 'oklch(0.75 0.02 260)' }}>variants</span>
          <Button variant="primary">primary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="destructive">destructive</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 16, alignItems: 'start', marginBottom: 20 }}>
          {BUTTON_VARIANTS.map((v) =>
            BUTTON_SIZES.map((s) => (
              <Cell key={`${v}-${s}`} label={`${v} / ${s}`}>
                <Button variant={v} size={s}>{v}</Button>
              </Cell>
            )),
          )}
        </div>
        <Separator />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
          <Cell label="default"><Button>Default</Button></Cell>
          <Cell label="hover (visual)"><Button>Hover me</Button></Cell>
          <Cell label="disabled"><Button disabled>Disabled</Button></Cell>
          <Cell label="isLoading"><Button isLoading>Loading</Button></Cell>
          <Cell label="leftIcon"><Button leftIcon={<IconPlus />}>Add item</Button></Cell>
          <Cell label="rightIcon"><Button rightIcon={<IconArrow />}>Continue</Button></Cell>
        </div>
      </section>

      {/* BADGE */}
      <section id="badge" style={sectionStyle}>
        <h2 style={sectionH2}>Badge</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 14, alignItems: 'start' }}>
          {TONES.map((t) =>
            CHIP_BADGE_VARIANTS.map((v) => (
              <Cell key={`${t}-${v}`} label={`${t} / ${v}`}>
                <Badge tone={t} variant={v}>{t}</Badge>
              </Cell>
            )),
          )}
        </div>
      </section>

      {/* CHIP */}
      <section id="chip" style={sectionStyle}>
        <h2 style={sectionH2}>Chip</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 14, alignItems: 'start', marginBottom: 20 }}>
          {TONES.map((t) =>
            CHIP_BADGE_VARIANTS.map((v) => (
              <Cell key={`${t}-${v}`} label={`${t} / ${v}`}>
                <Chip tone={t} variant={v}>{t}</Chip>
              </Cell>
            )),
          )}
        </div>
        <Separator />
        <div style={{ marginTop: 16 }}>
          <span style={labelStyle}>Removable</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <Chip
                key={c}
                tone="accent"
                variant="soft"
                onRemove={() => {
                  console.log('remove', c)
                  setChips((prev) => prev.filter((x) => x !== c))
                }}
              >
                {c}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* CARD */}
      <section id="card" style={sectionStyle}>
        <h2 style={sectionH2}>Card</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {(['sm', 'md', 'lg'] as const).map((p) => (
            <div key={p}>
              <span style={labelStyle}>padding: {p}</span>
              <Card padding={p}>
                <Card.Header>Card header</Card.Header>
                <Card.Body>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>
                    Body with padding size {p}.
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button size="sm" variant="ghost">Cancel</Button>
                  <Button size="sm">Save</Button>
                </Card.Footer>
              </Card>
            </div>
          ))}
          <div>
            <span style={labelStyle}>elevated</span>
            <Card elevated>
              <Card.Header>Elevated</Card.Header>
              <Card.Body><div style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Shadow-md.</div></Card.Body>
              <Card.Footer>
                <Button size="sm">Action</Button>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </section>

      {/* AVATAR */}
      <section id="avatar" style={sectionStyle}>
        <h2 style={sectionH2}>Avatar</h2>
        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>With image (sm/md/lg/40/64)</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name="Ada Lovelace" src="https://i.pravatar.cc/150?u=ada" size="sm" />
            <Avatar name="Grace Hopper" src="https://i.pravatar.cc/150?u=grace" size="md" />
            <Avatar name="Alan Turing" src="https://i.pravatar.cc/150?u=alan" size="lg" />
            <Avatar name="Edsger Dijkstra" src="https://i.pravatar.cc/150?u=edsger" size={40} />
            <Avatar name="Linus Torvalds" src="https://i.pravatar.cc/150?u=linus" size={64} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>Initials only</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name="Ada Lovelace" size="sm" />
            <Avatar name="Grace Hopper" size="md" />
            <Avatar name="Alan Turing" size="lg" />
            <Avatar name="Edsger Dijkstra" size={40} />
            <Avatar name="Linus Torvalds" size={64} />
          </div>
        </div>
        <div>
          <span style={labelStyle}>Broken src → onError fallback</span>
          <Avatar name="Fallback User" src="https://invalid.example.test/nope.png" size={48} />
        </div>
      </section>

      {/* SEPARATOR */}
      <section id="separator" style={sectionStyle}>
        <h2 style={sectionH2}>Separator</h2>
        <div style={{ marginBottom: 20 }}>
          <span style={labelStyle}>Horizontal</span>
          <div style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Above</div>
          <Separator />
          <div style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Below</div>
        </div>
        <div>
          <span style={labelStyle}>Vertical</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
            <span style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Left</span>
            <Separator orientation="vertical" />
            <span style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Middle</span>
            <Separator orientation="vertical" />
            <span style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Right</span>
          </div>
        </div>
      </section>

      {/* INPUT */}
      <section id="input" style={sectionStyle}>
        <h2 style={sectionH2}>Input</h2>
        {(['sm', 'md'] as const).map((sz) => (
          <div key={sz} style={{ marginBottom: 16 }}>
            <span style={labelStyle}>size: {sz}</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <Cell label="default"><Input size={sz} defaultValue="Hello" /></Cell>
              <Cell label="placeholder"><Input size={sz} placeholder="Type here…" /></Cell>
              <Cell label="prefix"><Input size={sz} prefix={<span>⌕</span>} placeholder="Search" /></Cell>
              <Cell label="suffix"><Input size={sz} suffix={<kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>⌘K</kbd>} placeholder="Command" /></Cell>
              <Cell label="invalid"><Input size={sz} invalid defaultValue="bad@" /></Cell>
              <Cell label="disabled"><Input size={sz} disabled defaultValue="locked" /></Cell>
            </div>
          </div>
        ))}
      </section>

      {/* TEXTAREA */}
      <section id="textarea" style={sectionStyle}>
        <h2 style={sectionH2}>Textarea</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <Cell label="plain"><Textarea defaultValue="Some text" style={{ width: '100%' }} /></Cell>
          <Cell label="placeholder"><Textarea placeholder="Write a note…" style={{ width: '100%' }} /></Cell>
          <Cell label="invalid"><Textarea invalid defaultValue="nope" style={{ width: '100%' }} /></Cell>
          <Cell label="autoResize">
            <Textarea autoResize value={textareaVal} onChange={(e) => setTextareaVal(e.target.value)} style={{ width: '100%' }} />
          </Cell>
        </div>
      </section>

      {/* SPINNER */}
      <section id="spinner" style={sectionStyle}>
        <h2 style={sectionH2}>Spinner</h2>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {[12, 16, 20, 28, 40].map((s) => (
            <Cell key={s} label={`${s}px`}><Spinner size={s} /></Cell>
          ))}
          <Cell label="custom color"><Spinner size={28} color="var(--ok)" /></Cell>
        </div>
      </section>

      {/* SKELETON */}
      <section id="skeleton" style={sectionStyle}>
        <h2 style={sectionH2}>Skeleton</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20, alignItems: 'start' }}>
          <div>
            <span style={labelStyle}>text (3 lines)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="70%" />
            </div>
          </div>
          <Cell label="block 120×80"><Skeleton variant="block" width={120} height={80} /></Cell>
          <Cell label="circle 48"><Skeleton variant="circle" width={48} /></Cell>
        </div>
      </section>

      {/* ALERT */}
      <section id="alert" style={sectionStyle}>
        <h2 style={sectionH2}>Alert</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ALERT_TONES.map((t, i) => (
            <Alert
              key={t}
              tone={t}
              title={`${t.toUpperCase()} alert`}
              onDismiss={i === 0 ? () => console.log('dismiss') : undefined}
            >
              This is a {t} alert with a title and body message explaining the state.
            </Alert>
          ))}
        </div>
      </section>

      {/* DIALOG */}
      <section id="dialog" style={sectionStyle}>
        <h2 style={sectionH2}>Dialog</h2>
        <div>
          <span style={labelStyle}>Controlled</span>
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Confirm action"
          description="This is a controlled dialog with title, body, and footer actions."
        >
          <Dialog.Body>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)' }}>
              Are you sure you want to proceed? This action can't be undone.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </Dialog.Footer>
        </Dialog>
      </section>

      {/* CHECKBOX */}
      <section id="checkbox" style={sectionStyle}>
        <h2 style={sectionH2}>Checkbox</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={inlineCell}><span style={labelStyle}>unchecked</span><Checkbox label="Default" checked={cb1} onCheckedChange={setCb1} /></div>
          <div style={inlineCell}><span style={labelStyle}>checked</span><Checkbox label="Accept" checked={cb2} onCheckedChange={setCb2} /></div>
          <div style={inlineCell}><span style={labelStyle}>indeterminate</span><Checkbox label="Partial" indeterminate /></div>
          <div style={inlineCell}><span style={labelStyle}>disabled</span><Checkbox label="Locked" disabled /></div>
          <div style={inlineCell}><span style={labelStyle}>invalid</span><Checkbox label="Needs attention" invalid /></div>
          <div style={inlineCell}><span style={labelStyle}>size sm</span><Checkbox label="Small" size="sm" /></div>
        </div>
      </section>

      {/* RADIO */}
      <section id="radio" style={sectionStyle}>
        <h2 style={sectionH2}>Radio</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={inlineCell}>
            <span style={labelStyle}>group</span>
            <RadioGroup value={radio} onValueChange={setRadio} name="plan">
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
              <Radio value="c" label="Option C" />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* SWITCH */}
      <section id="switch" style={sectionStyle}>
        <h2 style={sectionH2}>Switch</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={inlineCell}><span style={labelStyle}>md</span><Switch checked={sw} onCheckedChange={setSw} /></div>
          <div style={inlineCell}><span style={labelStyle}>sm</span><Switch size="sm" checked={sw} onCheckedChange={setSw} /></div>
          <div style={inlineCell}><span style={labelStyle}>disabled</span><Switch disabled checked={false} /></div>
        </div>
      </section>

      {/* SELECT */}
      <section id="select" style={sectionStyle}>
        <h2 style={sectionH2}>Select</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Cell label="default">
            <Select
              value={selVal}
              onValueChange={setSelVal}
              options={[
                { label: 'Apple', value: 'a' },
                { label: 'Banana', value: 'b' },
                { label: 'Cherry', value: 'c' },
              ]}
            />
          </Cell>
          <Cell label="invalid">
            <Select
              invalid
              defaultValue="a"
              options={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]}
            />
          </Cell>
          <Cell label="disabled">
            <Select
              disabled
              defaultValue="a"
              options={[{ label: 'A', value: 'a' }]}
            />
          </Cell>
        </div>
      </section>

      {/* SLIDER */}
      <section id="slider" style={sectionStyle}>
        <h2 style={sectionH2}>Slider</h2>
        <div style={{ maxWidth: 320 }}>
          <Slider value={slider} onValueChange={setSlider} />
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--fg-3)' }}>Value: {slider}</div>
        </div>
      </section>

      {/* TOGGLE GROUP */}
      <section id="toggle-group" style={sectionStyle}>
        <h2 style={sectionH2}>Toggle group</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Cell label="single">
            <ToggleGroup type="single" value={tgSingle} onValueChange={setTgSingle}>
              <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
              <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
              <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
            </ToggleGroup>
          </Cell>
          <Cell label="multiple">
            <ToggleGroup type="multiple" value={tgMulti} onValueChange={setTgMulti}>
              <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
              <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
              <ToggleGroup.Item value="under">U</ToggleGroup.Item>
            </ToggleGroup>
          </Cell>
        </div>
      </section>

      {/* TABS */}
      <section id="tabs" style={sectionStyle}>
        <h2 style={sectionH2}>Tabs</h2>
        <Tabs value={tabVal} onValueChange={setTabVal}>
          <Tabs.List>
            <Tabs.Trigger value="one">Overview</Tabs.Trigger>
            <Tabs.Trigger value="two">Details</Tabs.Trigger>
            <Tabs.Trigger value="three">Settings</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="one">Overview content.</Tabs.Content>
          <Tabs.Content value="two">Details content.</Tabs.Content>
          <Tabs.Content value="three">Settings content.</Tabs.Content>
        </Tabs>
      </section>

      {/* PROGRESS */}
      <section id="progress" style={sectionStyle}>
        <h2 style={sectionH2}>Progress</h2>
        <div style={{ display: 'grid', gap: 14, maxWidth: 400 }}>
          <div><span style={labelStyle}>25%</span><Progress value={25} /></div>
          <div><span style={labelStyle}>66%</span><Progress value={66} /></div>
          <div><span style={labelStyle}>indeterminate</span><Progress /></div>
        </div>
      </section>

      {/* EMPTY STATE */}
      <section id="empty-state" style={sectionStyle}>
        <h2 style={sectionH2}>Empty state</h2>
        <EmptyState
          icon={<span>∅</span>}
          title="Nothing here yet"
          description="Create your first item to get started."
          action={<Button>Create item</Button>}
        />
      </section>

      {/* BREADCRUMBS */}
      <section id="breadcrumbs" style={sectionStyle}>
        <h2 style={sectionH2}>Breadcrumbs</h2>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Docs', href: '/docs' },
            { label: 'Components', href: '/components' },
            { label: 'Breadcrumbs' },
          ]}
        />
      </section>

      {/* PAGINATION */}
      <section id="pagination" style={sectionStyle}>
        <h2 style={sectionH2}>Pagination</h2>
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </section>

      {/* STEPPER */}
      <section id="stepper" style={sectionStyle}>
        <h2 style={sectionH2}>Stepper</h2>
        <div style={{ marginBottom: 20 }}>
          <span style={labelStyle}>horizontal</span>
          <Stepper
            activeStep={1}
            steps={[
              { label: 'Account' },
              { label: 'Profile' },
              { label: 'Review' },
            ]}
          />
        </div>
        <div>
          <span style={labelStyle}>vertical</span>
          <Stepper
            orientation="vertical"
            activeStep={2}
            steps={[
              { label: 'Account', description: 'Create your account' },
              { label: 'Profile', description: 'Set your preferences' },
              { label: 'Review', description: 'Review and submit' },
            ]}
          />
        </div>
      </section>

      {/* ACCORDION */}
      <section id="accordion" style={sectionStyle}>
        <h2 style={sectionH2}>Accordion</h2>
        <Accordion type="single" value={accVal} onValueChange={setAccVal}>
          <Accordion.Item value="a">
            <Accordion.Trigger>What is Veloce UI?</Accordion.Trigger>
            <Accordion.Content>A motion-first React UI primitive library.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="b">
            <Accordion.Trigger>Does it ship CSS?</Accordion.Trigger>
            <Accordion.Content>Yes — a single file in a cascade layer so your CSS always wins.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="c">
            <Accordion.Trigger>Is it SSR safe?</Accordion.Trigger>
            <Accordion.Content>Yes. Zero runtime dependencies.</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>

      {/* TOOLTIP */}
      <section id="tooltip" style={sectionStyle}>
        <h2 style={sectionH2}>Tooltip</h2>
        <TooltipProvider>
          <div style={{ display: 'flex', gap: 20 }}>
            <Tooltip content="Save your changes"><Button>Save</Button></Tooltip>
            <Tooltip content="Discard without saving"><Button variant="ghost">Discard</Button></Tooltip>
          </div>
        </TooltipProvider>
      </section>

      {/* POPOVER */}
      <section id="popover" style={sectionStyle}>
        <h2 style={sectionH2}>Popover</h2>
        <Popover open={popOpen} onOpenChange={setPopOpen}>
          <Popover.Trigger><Button>Open popover</Button></Popover.Trigger>
          <Popover.Content>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Popover title</div>
            <div style={{ color: 'var(--fg-2)', fontSize: 13 }}>Click outside or press Esc to close.</div>
          </Popover.Content>
        </Popover>
      </section>

      {/* DROPDOWN */}
      <section id="dropdown" style={sectionStyle}>
        <h2 style={sectionH2}>Dropdown menu</h2>
        <DropdownMenu open={ddOpen} onOpenChange={setDdOpen}>
          <DropdownMenu.Trigger><Button variant="outline">Actions ▾</Button></DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onSelect={() => console.log('new')}>New</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => console.log('open')}>Open</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={() => console.log('delete')}>Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </section>

      {/* CHARTS */}
      <section id="charts" style={sectionStyle}>
        <h2 style={sectionH2}>Charts</h2>
        <p style={{ margin: '0 0 14px', color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.5 }}>
          Chart primitives from <code style={{ fontFamily: 'var(--font-mono)' }}>veloce-ui</code>. Pure SVG, theme-aware via CSS variables, SSR-safe.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))', gap: 16 }}>
          <div style={chartCell}>
            <span style={labelStyle}>Line</span>
            <LineChart
              width={380}
              height={200}
              data={[
                { label: 'W32', value: 64 },
                { label: 'W33', value: 72 },
                { label: 'W34', value: 58 },
                { label: 'W35', value: 90 },
                { label: 'W36', value: 84 },
                { label: 'W37', value: 102 },
                { label: 'W38', value: 96 },
                { label: 'W39', value: 118 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Area</span>
            <AreaChart
              width={380}
              height={200}
              data={[
                { label: 'W32', value: 40 },
                { label: 'W33', value: 46 },
                { label: 'W34', value: 52 },
                { label: 'W35', value: 48 },
                { label: 'W36', value: 60 },
                { label: 'W37', value: 66 },
                { label: 'W38', value: 72 },
                { label: 'W39', value: 80 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Bar</span>
            <BarChart
              width={380}
              height={200}
              showValues
              data={[
                { label: 'W32', value: 64 },
                { label: 'W33', value: 72 },
                { label: 'W34', value: 58 },
                { label: 'W35', value: 90 },
                { label: 'W36', value: 84 },
                { label: 'W37', value: 102 },
                { label: 'W38', value: 96 },
                { label: 'W39', value: 118 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Pie / Donut</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <PieChart
                data={[
                  { label: 'Pro', value: 46 },
                  { label: 'Team', value: 27 },
                  { label: 'Hobby', value: 17 },
                  { label: 'Enterprise', value: 10 },
                ]}
                size={170}
              />
              <PieChart
                data={[
                  { label: 'Pro', value: 46 },
                  { label: 'Team', value: 27 },
                  { label: 'Hobby', value: 17 },
                  { label: 'Enterprise', value: 10 },
                ]}
                size={170}
                innerRadius={60}
                centerLabel="27%"
                centerSublabel="Team"
              />
            </div>
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Sparkline</span>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', padding: '8px 0' }}>
              <SparklineChart data={[12, 14, 13, 18, 17, 22, 21, 26, 30]} />
              <SparklineChart data={[40, 38, 41, 37, 35, 36, 33, 31, 30]} color="var(--err)" />
              <SparklineChart data={[5, 9, 7, 12, 10, 14, 13, 15, 19]} showDot />
            </div>
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Scatter</span>
            <ScatterChart
              width={380}
              height={220}
              data={[
                { x: 12, y: 24 }, { x: 18, y: 42 }, { x: 24, y: 36 }, { x: 32, y: 58 },
                { x: 40, y: 44 }, { x: 48, y: 62 }, { x: 55, y: 70 }, { x: 62, y: 68 },
                { x: 70, y: 80 }, { x: 78, y: 72 }, { x: 86, y: 88 }, { x: 94, y: 92 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Candlestick</span>
            <CandleChart
              width={380}
              height={220}
              data={[
                { label: 'Mon', open: 120, high: 128, low: 118, close: 126 },
                { label: 'Tue', open: 126, high: 130, low: 122, close: 124 },
                { label: 'Wed', open: 124, high: 132, low: 123, close: 131 },
                { label: 'Thu', open: 131, high: 136, low: 129, close: 134 },
                { label: 'Fri', open: 134, high: 138, low: 128, close: 130 },
                { label: 'Mon2', open: 130, high: 142, low: 129, close: 141 },
                { label: 'Tue2', open: 141, high: 146, low: 139, close: 144 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Radar</span>
            <RadarChart
              size={240}
              data={[
                { axis: 'Speed', value: 82 },
                { axis: 'Quality', value: 74 },
                { axis: 'Coverage', value: 68 },
                { axis: 'Scale', value: 90 },
                { axis: 'Cost', value: 56 },
                { axis: 'UX', value: 86 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Funnel</span>
            <FunnelChart
              width={380}
              height={240}
              data={[
                { label: 'Visits', value: 10000 },
                { label: 'Sign-ups', value: 4200 },
                { label: 'Activated', value: 2600 },
                { label: 'Paid', value: 980 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Waterfall</span>
            <WaterfallChart
              width={380}
              height={240}
              showValues
              data={[
                { label: 'Start', value: 100, type: 'total' },
                { label: 'Sales', value: 48 },
                { label: 'Refunds', value: -12 },
                { label: 'Fees', value: -8 },
                { label: 'End', value: 0, type: 'total' },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Treemap</span>
            <TreemapChart
              width={380}
              height={240}
              data={[
                { label: 'Pro', value: 46 },
                { label: 'Team', value: 27 },
                { label: 'Hobby', value: 17 },
                { label: 'Enterprise', value: 10 },
                { label: 'Trial', value: 6 },
              ]}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Heatmap</span>
            <HeatmapChart
              width={380}
              height={220}
              data={(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).flatMap((d) =>
                ['9', '12', '15', '18', '21'].map((h) => ({
                  x: h,
                  y: d,
                  value: Math.round(20 + ((d.charCodeAt(0) + Number(h)) % 70)),
                })),
              )}
            />
          </div>
          <div style={chartCell}>
            <span style={labelStyle}>Gauge</span>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <GaugeChart value={72} label="72" sublabel="Lighthouse performance" />
              <GaugeChart value={38} label="38" sublabel="Needs work" color="var(--warn)" />
            </div>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section id="table" style={sectionStyle}>
        <h2 style={sectionH2}>Table</h2>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Column>Project</Table.Column>
              <Table.Column>Region</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column align="end">Builds</Table.Column>
            </Table.Row>
          </Table.Header>
          <tbody>
            <Table.Row>
              <Table.Cell>veloce-ui</Table.Cell>
              <Table.Cell>iad1</Table.Cell>
              <Table.Cell><Badge tone="ok" variant="soft">Ready</Badge></Table.Cell>
              <Table.Cell align="end">142</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>orderflow</Table.Cell>
              <Table.Cell>sfo1</Table.Cell>
              <Table.Cell><Badge tone="warn" variant="soft">Building</Badge></Table.Cell>
              <Table.Cell align="end">98</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>apiforge</Table.Cell>
              <Table.Cell>fra1</Table.Cell>
              <Table.Cell><Badge tone="err" variant="soft">Failed</Badge></Table.Cell>
              <Table.Cell align="end">34</Table.Cell>
            </Table.Row>
          </tbody>
        </Table>
      </section>

      {/* DATA GRID */}
      <section id="data-grid" style={sectionStyle}>
        <h2 style={sectionH2}>Data grid</h2>
        <DataGridDemo />
      </section>
    </DocsShell>
  )
}

type SimpleRow = {
  id: number
  project: string
  region: string
  status: string
  builds: number
}

const simpleRows: SimpleRow[] = [
  { id: 1, project: 'veloce-ui', region: 'iad1', status: 'Ready', builds: 142 },
  { id: 2, project: 'orderflow', region: 'sfo1', status: 'Building', builds: 98 },
  { id: 3, project: 'apiforge', region: 'fra1', status: 'Failed', builds: 34 },
  { id: 4, project: 'jsoncraft', region: 'iad1', status: 'Ready', builds: 220 },
  { id: 5, project: 'portpilot', region: 'syd1', status: 'Ready', builds: 61 },
]

const statusToneMap: Record<string, 'ok' | 'warn' | 'err' | 'neutral'> = {
  Ready: 'ok',
  Building: 'warn',
  Failed: 'err',
  Queued: 'neutral',
}

const simpleColumns: ColumnDef<SimpleRow>[] = [
  { key: 'project', header: 'Project', sortable: true },
  { key: 'region', header: 'Region', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (r) => (
      <Badge tone={statusToneMap[r.status] ?? 'neutral'} variant="soft">
        {r.status}
      </Badge>
    ),
  },
  { key: 'builds', header: 'Builds', align: 'end', sortable: true },
]

type BigRow = {
  id: number
  project: string
  region: string
  status: string
  builds: number
  owner: string
}

const regions = ['iad1', 'sfo1', 'fra1', 'syd1', 'hnd1', 'arn1']
const statuses = ['Ready', 'Building', 'Failed', 'Queued']
const bigRows: BigRow[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  project: `project-${i + 1}`,
  region: regions[i % regions.length],
  status: statuses[i % statuses.length],
  builds: (i * 7) % 500,
  owner: `user${i % 50}`,
}))

function DataGridDemo() {
  const [virtualize, setVirtualize] = useState(true)
  const [editedRows, setEditedRows] = useState<Record<number, Partial<BigRow>>>({})
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const bigColumns: ColumnDef<BigRow>[] = [
    { key: 'id', header: 'ID', pin: 'left', width: 80, align: 'end' },
    { key: 'project', header: 'Project', pin: 'left', width: 160, sortable: true, resizable: true },
    { key: 'region', header: 'Region', sortable: true, editable: true, editor: 'select', options: regions.map((r) => ({ label: r, value: r })) },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'owner', header: 'Owner', sortable: true, resizable: true, width: 140 },
    { key: 'builds', header: 'Builds', align: 'end', sortable: true, editable: true, editor: 'number' },
  ]

  const mergedRows = bigRows.map((r) => ({ ...r, ...(editedRows[r.id] ?? {}) }))

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.75 }}>Simple</h3>
        <DataGrid
          rows={simpleRows}
          columns={simpleColumns}
          rowKey={(r) => String(r.id)}
        />
      </div>

      <div
        style={{
          borderTop: '1px solid var(--line)',
          margin: '20px 0',
          paddingTop: 20,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.75 }}>
          Advanced — 2,000 rows, pinned + resizable + editable columns
        </h3>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={virtualize}
            onChange={(e) => setVirtualize(e.target.checked)}
          />
          <span>Virtualize</span>
        </label>
        <DataGrid
          rows={mergedRows}
          columns={bigColumns}
          rowKey={(r) => String(r.id)}
          virtualize={virtualize}
          pageSize={virtualize ? bigRows.length : 25}
          onCellEdit={(row: BigRow, key: string, value: string | number) => {
            setEditedRows((prev) => ({
              ...prev,
              [row.id]: { ...(prev[row.id] ?? {}), [key]: value },
            }))
          }}
        >
          <DataGrid.Toolbar />
        </DataGrid>
      </div>

      {/* Paginated + filtered variant — exercises quickFilter, controlled sort, controlled paging */}
      <div
        style={{
          borderTop: '1px solid var(--line)',
          margin: '20px 0',
          paddingTop: 20,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.75 }}>
          Paginated + filtered — quick search, per-column filters, Prev/Next
        </h3>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>Search</span>
            <Input
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFilter(e.target.value); setPageIndex(0) }}
              placeholder="Search project, owner, region…"
              style={{ width: 220 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>Status</span>
            <Select
              value={statusFilter}
              onValueChange={(v: string) => { setStatusFilter(v); setPageIndex(0) }}
              options={[{ label: 'All', value: 'all' }, ...statuses.map((s) => ({ label: s, value: s }))]}
              style={{ width: 140 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>Region</span>
            <Select
              value={regionFilter}
              onValueChange={(v: string) => { setRegionFilter(v); setPageIndex(0) }}
              options={[{ label: 'All', value: 'all' }, ...regions.map((r) => ({ label: r, value: r }))]}
              style={{ width: 140 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>Rows / page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v: string) => { setPageSize(Number(v)); setPageIndex(0) }}
              options={[10, 25, 50, 100].map((n) => ({ label: String(n), value: String(n) }))}
              style={{ width: 90 }}
            />
          </div>
        </div>

        {(() => {
          const base = mergedRows.filter((r) => {
            if (statusFilter !== 'all' && r.status !== statusFilter) return false
            if (regionFilter !== 'all' && r.region !== regionFilter) return false
            if (filter) {
              const q = filter.toLowerCase()
              if (
                !r.project.toLowerCase().includes(q) &&
                !r.owner.toLowerCase().includes(q) &&
                !r.region.toLowerCase().includes(q) &&
                !r.status.toLowerCase().includes(q)
              ) return false
            }
            return true
          })
          const totalPages = Math.max(1, Math.ceil(base.length / pageSize))
          const safePage = Math.min(pageIndex, totalPages - 1)
          const start = safePage * pageSize
          const slice = base.slice(start, start + pageSize)

          return (
            <>
              <DataGrid
                rows={slice}
                columns={bigColumns}
                rowKey={(r: BigRow) => String(r.id)}
                emptyState={<span style={{ color: 'var(--fg-3)', fontSize: 13 }}>No matches for your filters.</span>}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: 12.5, color: 'var(--fg-3)' }}>
                <span>
                  {base.length === 0
                    ? '0 results'
                    : `${start + 1}–${Math.min(start + pageSize, base.length)} of ${base.length.toLocaleString()}`}
                </span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage === 0}
                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  >
                    ‹ Prev
                  </Button>
                  <span>Page {safePage + 1} of {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages - 1}
                    onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Next ›
                  </Button>
                </div>
              </div>
            </>
          )
        })()}
      </div>

      {/* Checkbox selection — multi-select with bulk action bar */}
      <div
        style={{
          borderTop: '1px solid var(--line)',
          margin: '20px 0',
          paddingTop: 20,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.75 }}>
          Checkbox selection — multi-select with bulk actions
        </h3>
        <p style={{ margin: '0 0 10px', color: 'var(--fg-3)', fontSize: 12.5 }}>
          Click the header checkbox to toggle all; click any row's checkbox to add/remove it from the selection.
          Space on a focused row also toggles it.
        </p>
        {selectedIds.size > 0 && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              padding: '8px 12px', border: '1px solid var(--ac-line)', borderRadius: 8,
              background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 13,
            }}
          >
            <strong style={{ fontWeight: 500 }}>{selectedIds.size} selected</strong>
            <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            <Button size="sm" variant="outline" onClick={() => alert(`Would redeploy ${selectedIds.size} rows`)}>Redeploy</Button>
            <Button size="sm" variant="destructive" onClick={() => alert(`Would delete ${selectedIds.size} rows`)}>Delete</Button>
          </div>
        )}
        <DataGrid
          rows={simpleRows}
          columns={simpleColumns}
          rowKey={(r: SimpleRow) => String(r.id)}
          selectable
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
        />
      </div>

      {/* Row highlighting — click to focus/highlight one row */}
      <div
        style={{
          borderTop: '1px solid var(--line)',
          margin: '20px 0',
          paddingTop: 20,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.75 }}>
          Row highlighting — click to spotlight a single row
        </h3>
        <p style={{ margin: '0 0 10px', color: 'var(--fg-3)', fontSize: 12.5 }}>
          Hover shows the default row background; clicking a row sets it to the active-accent background. Pattern is implemented via per-row <code style={{ fontFamily: 'var(--font-mono)' }}>onClick</code> on the <code style={{ fontFamily: 'var(--font-mono)' }}>render</code> callback — DataGrid stays uncontrolled.
        </p>
        <DataGrid
          rows={simpleRows}
          columns={[
            {
              key: 'project',
              header: 'Project',
              sortable: true,
              render: (row: SimpleRow) => (
                <button
                  type="button"
                  onClick={() => setHighlightedId((cur) => (cur === String(row.id) ? null : String(row.id)))}
                  style={{
                    all: 'unset', cursor: 'pointer', color: 'inherit',
                    fontWeight: String(row.id) === highlightedId ? 600 : 400,
                  }}
                >
                  {row.project}
                </button>
              ),
            },
            ...simpleColumns.slice(1).map((c) => ({ ...c })),
          ] as ColumnDef<SimpleRow>[]}
          rowKey={(r: SimpleRow) => String(r.id)}
          rowStyle={(r: SimpleRow) =>
            String(r.id) === highlightedId
              ? { background: 'color-mix(in oklch, var(--ac) 18%, transparent)' }
              : undefined
          }
        />
        {highlightedId && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--fg-3)' }}>
            Highlighted row id: <code style={{ fontFamily: 'var(--font-mono)' }}>{highlightedId}</code>{' '}
            <button
              onClick={() => setHighlightedId(null)}
              style={{ background: 'none', border: 'none', color: 'var(--ac-text)', cursor: 'pointer', padding: 0, fontSize: 12.5 }}
            >
              clear
            </button>
          </div>
        )}
      </div>
    </>
  )
}
