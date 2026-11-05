// All routes that start with /api/conversations live in this file.
// The data now comes from MongoDB (collection whatsapp_conversations).
import { Router } from 'express'
import Conversation from '../src/models/conversation.model.js'

const router = Router()

// Fields we do NOT send in the Inbox list (the thread page loads them separately).
// "-" means "leave this field out".
const LIST_FIELDS = '-_id -__v -messages -phone -status -invoice -createdAt -updatedAt'

// Turns the :id in the URL (text) into a number. Returns null if it is not a number.
function getId(req) {
  const id = Number(req.params.id)
  return Number.isNaN(id) ? null : id
}

// GET /api/conversations
// Sends the whole list of chats as JSON (Inbox, sidebar badge, chat dropdown).
router.get('/', async (req, res) => {
  try {
    const chats = await Conversation.find().select(LIST_FIELDS).lean()
    res.json(chats)
  } catch (error) {
    console.error('GET /api/conversations failed:', error.message)
    res.status(500).json({ error: 'Could not load conversations' })
  }
})

// PATCH /api/conversations/:id/read
// Marks one chat as read (unread becomes 0).
router.patch('/:id/read', async (req, res) => {
  try {
    const id = getId(req)
    if (id === null) return res.status(404).json({ error: 'Conversation not found' })

    const chat = await Conversation.findOneAndUpdate(
      { id },
      { unread: 0 },
      { returnDocument: 'after' } // give back the chat AFTER the change
    )
      .select(LIST_FIELDS)
      .lean()

    if (!chat) return res.status(404).json({ error: 'Conversation not found' })
    res.json(chat)
  } catch (error) {
    console.error('PATCH read failed:', error.message)
    res.status(500).json({ error: 'Could not mark conversation as read' })
  }
})

// PATCH /api/conversations/:id/star
// Stars or un-stars one chat.
router.patch('/:id/star', async (req, res) => {
  try {
    const id = getId(req)
    if (id === null) return res.status(404).json({ error: 'Conversation not found' })

    const chat = await Conversation.findOne({ id })
    if (!chat) return res.status(404).json({ error: 'Conversation not found' })

    chat.starred = !chat.starred // flip true <-> false
    await chat.save()

    const updated = await Conversation.findOne({ id }).select(LIST_FIELDS).lean()
    res.json(updated)
  } catch (error) {
    console.error('PATCH star failed:', error.message)
    res.status(500).json({ error: 'Could not star conversation' })
  }
})

export default router