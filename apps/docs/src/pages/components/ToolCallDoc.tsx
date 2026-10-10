import { ToolCall } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function ToolCallDoc() {
  return (
    <ComponentDoc
      slug="tool-call"
      name="ToolCall"
      description="Collapsible tool/function call display — the function_call chrome in Claude / GPT UIs. Shows tool name, status indicator, expandable args + result blocks."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 540 }}>
          <ToolCall
            name="read_file"
            status="success"
            defaultOpen
            args={`{ "path": "src/App.tsx", "offset": 1, "limit": 20 }`}
            result={`import { lazy } from 'react'\nimport { Routes, Route } from 'react-router-dom'\n...`}
          />
          <ToolCall
            name="run_sql"
            status="running"
            defaultOpen
            args={`SELECT COUNT(*) FROM users WHERE active = true;`}
          />
          <ToolCall
            name="deploy_production"
            status="error"
            args={`{ "env": "prod", "branch": "main" }`}
            result={`Error: TypeError in app/layout.tsx:42\n  Session is not assignable to User`}
          />
          <ToolCall name="web_search" status="pending" />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ToolCall }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ToolCall name=<span className="s">"read_file"</span> status=<span className="s">"success"</span>{'\n'}
          {'  '}args={'{'}JSON.stringify(args){'}'}{'\n'}
          {'  '}result={'{'}output{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
