import { useState } from 'react'
import { FileUpload } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function FileUploadDoc() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <ComponentDoc
      slug="file-upload"
      name="FileUpload"
      description="Drag-and-drop file picker with click fallback. Shows the selected file list; supports multiple + size validation."
      preview={
        <div style={{ width: '100%', maxWidth: 460 }}>
          <FileUpload
            value={files}
            onValueChange={setFiles}
            multiple
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024}
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ FileUpload }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>FileUpload{'\n'}
          {'  '}<span className="p">multiple</span>{'\n'}
          {'  '}<span className="p">accept=</span><span className="s">"image/*"</span>{'\n'}
          {'  '}<span className="p">maxSize=</span>{'{'}5 * 1024 * 1024{'}'}{'\n'}
          {'  '}<span className="p">onValueChange=</span>{'{'}setFiles{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
