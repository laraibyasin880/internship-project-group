// The bottom area: round template chips, a text box and a round Send button.
// The templates come from the server: GET /api/templates?type=quote|invoice
import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { getTemplates } from '../../api/templates'

// These two templates make no sense when the invoice is already paid.
const UNPAID_ONLY = ['Payment reminder', 'Overdue notice']

// Replaces the placeholders in a template with real values.
function fillTemplate(text, values) {
  return text
    .replaceAll('{customer_name}', values.customerName)
    .replaceAll('{amount}', values.amount)
    .replaceAll('{due_date}', values.dueDate || '')
}

// Props:
//   onSend       = function called with the message text
//   values       = { customerName, amount, dueDate } used to fill the templates
//   templateType = 'quote' or 'invoice' (which templates to show). Default: 'quote'
//   isPaid       = true when the invoice is already paid (hides the reminder templates)
export default function ReplyBox({ onSend, values, templateType = 'quote', isPaid = false }) {
  // STATE: the text typed in the box, the templates from the server, and an error text
  const [text, setText] = useState('')
  const [templates, setTemplates] = useState([])
  const [templatesError, setTemplatesError] = useState('')

  // Loads the templates from the server when the box opens (and when the type changes)
  useEffect(() => {
    let cancelled = false // ignore the answer if the page changed meanwhile

    async function load() {
      try {
        const data = await getTemplates(templateType)
        if (!cancelled) {
          setTemplates(data)
          setTemplatesError('')
        }
      } catch (err) {
        console.error('Templates error:', err)
        if (!cancelled) setTemplatesError('Could not load templates.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [templateType])

  // Paid invoice: hide the "unpaid only" templates
  const shownTemplates = templates.filter((t) => !(isPaid && UNPAID_ONLY.includes(t.name)))

  function send() {
    const clean = text.trim()
    if (!clean) return
    onSend(clean)
    setText('')
  }

  // Enter sends, Shift + Enter makes a new line
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="shrink-0 border-t border-line bg-white">
      {/* Template chips: clicking one puts its text in the box (you can still edit it) */}
      <div className="flex gap-2 overflow-x-auto px-3 pt-3">
        {templatesError && (
          <p role="alert" className="py-3 text-xs font-semibold text-danger">
            {templatesError}
          </p>
        )}
        {shownTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => setText(fillTemplate(t.text, values))}
            className="min-h-11 shrink-0 rounded-full border border-line bg-white px-4 text-xs font-semibold text-muted hover:bg-navy-50"
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Text box and Send button */}
      <div className="flex items-end gap-2 p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message…"
          className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-page px-4 py-[11px] text-sm leading-5 text-ink placeholder:text-muted focus:border-navy-700 focus:outline-none"
        />
        {/* The one accent (orange) button: orange background, navy icon */}
        <button
          onClick={send}
          disabled={!text.trim()}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-navy-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}