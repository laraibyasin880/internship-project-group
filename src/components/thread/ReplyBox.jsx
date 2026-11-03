// The bottom area: round template chips, a text box and a round Send button.
import { useState } from 'react'
import { Send } from 'lucide-react'
import { templates } from '../../data/templates'

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
export default function ReplyBox({ onSend, values, templateType = 'quote' }) {
  // STATE: the text typed in the box
  const [text, setText] = useState('')

  // Only the templates that belong to this kind of chat
  const shownTemplates = templates.filter((t) => t.type === templateType)

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