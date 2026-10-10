import { DiffViewer } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

const SAMPLE = `--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,10 +1,11 @@
 import { lazy, Suspense } from 'react'
 import { Routes, Route } from 'react-router-dom'
+import { ToastProvider } from 'veloce-ui'

 const Landing = lazy(() => import('./pages/Landing'))

 export default function App() {
   return (
-    <Suspense fallback={null}>
+    <Suspense fallback={<div className="loading">...</div>}>
+      <ToastProvider />
       <Routes>
         <Route path="/" element={<Landing />} />
       </Routes>`

export default function DiffViewerDoc() {
  return (
    <ComponentDoc
      slug="diff-viewer"
      name="DiffViewer"
      description="Unified diff viewer — the proposed-edit chrome in agent / code-assist UIs. Pass a raw unified diff or a pre-parsed line array. Shows +/− counts in the header."
      preview={
        <div style={{ width: '100%', maxWidth: 600 }}>
          <DiffViewer diff={SAMPLE} filename="src/App.tsx" language="tsx" />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ DiffViewer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>DiffViewer diff={'{'}unifiedDiff{'}'} filename=<span className="s">"src/App.tsx"</span> language=<span className="s">"tsx"</span> <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
