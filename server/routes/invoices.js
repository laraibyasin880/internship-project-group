// // All routes that start with /api/invoices live in this file.
// import { Router } from 'express'
// import { threads } from '../data/threads.js'
// import { conversations } from '../data/conversations.js'

// const router = Router()

// // Current time like "9:41 AM"
// function nowTime() {
//   return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
// }

// // POST /api/invoices/:id/reminder
// // Ali sends a payment reminder. Body (JSON): { "text": "Hi Mr. Ahmed, ..." }
// // Unknown invoice -> 404. Invoice already Paid -> 400. Empty text -> 400.
// // The server adds TWO items to the chat: a grey system note and the reminder message.
// router.post('/:id/reminder', (req, res) => {
//   const thread = threads[req.params.id]
//   if (!thread || thread.type !== 'invoice') {
//     return res.status(404).json({ error: 'Invoice not found' })
//   }
//   if (thread.status === 'Paid') {
//     return res.status(400).json({ error: 'This invoice is already paid' })
//   }

//   const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
//   if (!text) return res.status(400).json({ error: 'Reminder text is required' })

//   // New messages get the next free ids in this chat
//   const nextId = Math.max(0, ...thread.messages.map((m) => m.id)) + 1
//   const note = { id: nextId, from: 'system', text: 'Manual reminder sent' }
//   const message = { id: nextId + 1, from: 'tradesperson', text, time: nowTime(), ticks: 'sent' }
//   thread.messages.push(note, message)

//   // Also update the chat row in the Inbox (last message and time)
//   const chat = conversations.find((c) => c.id === Number(req.params.id))
//   if (chat) {
//     chat.lastMessage = text
//     chat.time = message.time
//   }

//   res.status(201).json([note, message])
// })

// export default router
// All routes that start with /api/invoices live in this file.
// The reminder message is saved inside the invoice chat in MongoDB.
import { Router } from 'express'
import Conversation from '../src/models/conversation.model.js'

const router = Router()

// Current time like "9:41 AM"
function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// POST /api/invoices/:id/reminder
// Ali sends a payment reminder for one invoice chat.
// Optional body (JSON): { "text": "your own reminder text" }
// Unknown id or not an invoice -> 404. Already paid -> 400.
router.post('/:id/reminder', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(404).json({ error: 'Invoice not found' })

    const chat = await Conversation.findOne({ id })
    if (!chat || chat.type !== 'invoice') {
      return res.status(404).json({ error: 'Invoice not found' })
    }
    if (chat.status === 'Paid') {
      return res.status(400).json({ error: 'This invoice is already paid' })
    }

    // Use the text from React if it sent one, otherwise a default reminder
    const customText = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
    const text =
      customText ||
      `Friendly reminder: invoice ${chat.invoice?.ref ?? ''} for ${chat.invoice?.total ?? ''} is due. Please let me know if you have any questions.`

    // The new message gets the next free id in this chat
    const nextId = Math.max(0, ...chat.messages.map((m) => m.id)) + 1
    const message = { id: nextId, from: 'tradesperson', text, time: nowTime(), ticks: 'sent' }

    chat.messages.push(message)
    chat.lastMessage = text
    chat.time = message.time
    await chat.save()

    res.status(201).json(message)
  } catch (error) {
    console.error('POST /api/invoices/:id/reminder failed:', error.message)
    res.status(500).json({ error: 'Could not send reminder' })
  }
})

export default router