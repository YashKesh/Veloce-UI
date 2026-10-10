import { useState } from 'react'
import { Form, Input, Textarea, Button } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function FormDoc() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const invalidEmail = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <ComponentDoc
      slug="form"
      name="Form"
      description="Composable form primitives — Field, Label, Control, Description, Error — with proper a11y wiring (htmlFor, aria-describedby, aria-invalid)."
      preview={
        <Form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Form.Field invalid={invalidEmail}>
            <Form.Label required>Email</Form.Label>
            <Form.Control>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@acme.com" />
            </Form.Control>
            <Form.Description>We'll never share your address.</Form.Description>
            {invalidEmail && <Form.Error>Please enter a valid email address.</Form.Error>}
          </Form.Field>
          <Form.Field>
            <Form.Label optional>Message</Form.Label>
            <Form.Control>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say hi…" />
            </Form.Control>
          </Form.Field>
          <Button variant="primary" type="submit" disabled={invalidEmail || !email}>
            {submitted ? 'Sent ✓' : 'Submit'}
          </Button>
        </Form>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Form, Input }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Form<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Form.Field <span className="p">invalid=</span>{'{'}!!error{'}'}<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Form.Label <span className="p">required</span><span className="p">&gt;</span>Email<span className="p">&lt;/</span>Form.Label<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Form.Control<span className="p">&gt;</span><span className="p">&lt;</span>Input <span className="p">/&gt;</span><span className="p">&lt;/</span>Form.Control<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Form.Error<span className="p">&gt;</span>{'{'}error{'}'}<span className="p">&lt;/</span>Form.Error<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Form.Field<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Form<span className="p">&gt;</span>
        </>
      }
    />
  )
}
