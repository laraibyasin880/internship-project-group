// All routes that start with /api/threads live in this file.
import { Router } from 'express'
import { threads } from '../data/threads.js'

const router = Router()

// GET /api/threads/:id
// Sends ONE chat (customer, phone, status, messages) as JSON.
// If the id does not exist we answer with 404 (not found).
router.get('/:id', (req, res) => {
  const thread = threads[req.params.id]
  if (!thread) return res.status(404).json({ error: 'Thread not found' })

  res.json({ id: Number(req.params.id), ...thread })
})

export default router