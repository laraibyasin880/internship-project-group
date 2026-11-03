// All routes that start with /api/threads live in this file.
import { Router } from 'express'
import { threads } from '../data/threads.js'
import { conversations } from '../data/conversations.js'

const router = Router()

// Current time like "9:41 AM"
function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// GET /api/threads/:id
// Sends ONE chat (customer, phone, status, messages) as JSON.
// If the id does not exist we answer with 404 (not found).
router.get('/:id', (req, res) => {
  const thread = threads[req.params.id]
  if (!thread) return res.status(404).json({ error: 'Thread not found' })

  res.json({ id: Number(req.params.id), ...thread })
})

// POST /api/threads/:id/messages
// Ali sends a new message. Body (JSON): { "text": "Hello" }
// Unknown id -> 404. Empty text -> 400.
router.post('/:id/messages', (req, res) => {
  const thread = threads[req.params.id]
  if (!thread) return res.status(404).json({ error: 'Thread not found' })

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  if (!text) return res.status(400).json({ error: 'Message text is required' })

  // The new message gets the next free id in this chat
  const nextId = Math.max(0, ...thread.messages.map((m) => m.id)) + 1
  const message = { id: nextId, from: 'tradesperson', text, time: nowTime(), ticks: 'sent' }
  thread.messages.push(message)

  // Also update the chat row in the Inbox (last message and time)
  const chat = conversations.find((c) => c.id === Number(req.params.id))
  if (chat) {
    chat.lastMessage = text
    chat.time = message.time
  }

  res.status(201).json(message)
})

export default router