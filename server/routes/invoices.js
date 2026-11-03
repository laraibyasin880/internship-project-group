// All routes that start with /api/invoices live in this file.
import { Router } from 'express'
import { threads } from '../data/threads.js'
import { conversations } from '../data/conversations.js'

const router = Router()

// Current time like "9:41 AM"
function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// POST /api/invoices/:id/reminder
// Ali sends a payment reminder. Body (JSON): { "text": "Hi Mr. Ahmed, ..." }
// Unknown invoice -> 404. Invoice already Paid -> 400. Empty text -> 400.
// The server adds TWO items to the chat: a grey system note and the reminder message.
router.post('/:id/reminder', (req, res) => {
  const thread = threads[req.params.id]
  if (!thread || thread.type !== 'invoice') {
    return res.status(404).json({ error: 'Invoice not found' })
  }
  if (thread.status === 'Paid') {
    return res.status(400).json({ error: 'This invoice is already paid' })
  }

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  if (!text) return res.status(400).json({ error: 'Reminder text is required' })

  // New messages get the next free ids in this chat
  const nextId = Math.max(0, ...thread.messages.map((m) => m.id)) + 1
  const note = { id: nextId, from: 'system', text: 'Manual reminder sent' }
  const message = { id: nextId + 1, from: 'tradesperson', text, time: nowTime(), ticks: 'sent' }
  thread.messages.push(note, message)

  // Also update the chat row in the Inbox (last message and time)
  const chat = conversations.find((c) => c.id === Number(req.params.id))
  if (chat) {
    chat.lastMessage = text
    chat.time = message.time
  }

  res.status(201).json([note, message])
})

export default router