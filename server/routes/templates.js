// All routes that start with /api/templates live in this file (read-only).
import { Router } from 'express'
import { templates } from '../data/templates.js'

const router = Router()

// GET /api/templates            -> all templates
// GET /api/templates?type=quote -> only quote templates
// GET /api/templates?type=invoice -> only invoice templates
// Any other type -> 400 (bad request)
router.get('/', (req, res) => {
  const { type } = req.query

  if (!type) return res.json(templates)

  if (type !== 'quote' && type !== 'invoice') {
    return res.status(400).json({ error: 'type must be quote or invoice' })
  }

  res.json(templates.filter((t) => t.type === type))
})

export default router