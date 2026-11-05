// All routes that start with /api/threads live in this file.
// A thread is one chat WITH its messages. It now comes from MongoDB
// (collection whatsapp_conversations), where the messages are stored inside the chat.
import { Router } from 'express'
import Conversation from '../src/models/conversation.model.js'

const router = Router()

// Current time like "9:41 AM"
function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// Turns the :id in the URL (text) into a number. Returns null if it is not a number.
function getId(req) {
  const id = Number(req.params.id)
  return Number.isNaN(id) ? null : id
}

// GET /api/threads/:id
// Sends ONE chat (customer, phone, status, messages) as JSON.
// If the id does not exist, or the chat has no thread (for example a review chat), we answer 404.
router.get('/:id', async (req, res) => {
  try {
    const id = getId(req)
    if (id === null) return res.status(404).json({ error: 'Thread not found' })

    const chat = await Conversation.findOne({ id })
      .select('-_id -__v -createdAt -updatedAt')
      .lean()

    // A chat without phone, status and messages has no thread page
    const hasThread = chat && (chat.phone || chat.status || chat.messages.length > 0)
    if (!hasThread) return res.status(404).json({ error: 'Thread not found' })

    res.json(chat)
  } catch (error) {
    console.error('GET /api/threads/:id failed:', error.message)
    res.status(500).json({ error: 'Could not load thread' })
  }
})

// POST /api/threads/:id/messages
// Ali sends a new message. Body (JSON): { "text": "Hello" }
// Unknown id -> 404. Empty text -> 400.
router.post('/:id/messages', async (req, res) => {
  try {
    const id = getId(req)
    if (id === null) return res.status(404).json({ error: 'Thread not found' })

    const chat = await Conversation.findOne({ id })
    if (!chat) return res.status(404).json({ error: 'Thread not found' })

    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
    if (!text) return res.status(400).json({ error: 'Message text is required' })

    // The new message gets the next free id in this chat
    const nextId = Math.max(0, ...chat.messages.map((m) => m.id)) + 1
    const message = { id: nextId, from: 'tradesperson', text, time: nowTime(), ticks: 'sent' }

    chat.messages.push(message)

    // Also update the chat row in the Inbox (last message and time)
    chat.lastMessage = text
    chat.time = message.time

    await chat.save()

    res.status(201).json(message)
  } catch (error) {
    console.error('POST /api/threads/:id/messages failed:', error.message)
    res.status(500).json({ error: 'Could not send message' })
  }
})

export default router