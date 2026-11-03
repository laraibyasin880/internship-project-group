// All routes that start with /api/conversations live in this file.
import { Router } from 'express'
import { conversations } from '../data/conversations.js'

const router = Router()

// Finds one chat by the :id in the URL. The URL id is text, so we turn it into a number.
function findConversation(req) {
  return conversations.find((c) => c.id === Number(req.params.id))
}

// GET /api/conversations
// Sends the whole list of chats as JSON (Inbox, sidebar badge, chat dropdown).
router.get('/', (req, res) => {
  res.json(conversations)
})

// PATCH /api/conversations/:id/read
// Marks one chat as read (unread becomes 0).
router.patch('/:id/read', (req, res) => {
  const chat = findConversation(req)
  if (!chat) return res.status(404).json({ error: 'Conversation not found' })

  chat.unread = 0
  res.json(chat)
})

// PATCH /api/conversations/:id/star
// Stars or un-stars one chat.
router.patch('/:id/star', (req, res) => {
  const chat = findConversation(req)
  if (!chat) return res.status(404).json({ error: 'Conversation not found' })

  chat.starred = !chat.starred
  res.json(chat)
})

export default router