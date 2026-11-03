// Entry point of the TradesDash server.
// This file creates the Express app, adds helpers and connects the route files.
import express from 'express'
import cors from 'cors'
import conversationsRouter from './routes/conversations.js'
import threadsRouter from './routes/threads.js'
import invoicesRouter from './routes/invoices.js'

const app = express()
const PORT = 5000

// Middleware = a helper that runs on every request before our routes.
app.use(cors())          // lets the browser talk to this server
app.use(express.json())  // lets the server read JSON sent by React

// A tiny test route. Open http://localhost:5000/api/health in the browser.
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'TradesDash server is running' })
})

// Every URL that starts with /api/conversations goes to routes/conversations.js
app.use('/api/conversations', conversationsRouter)

// Every URL that starts with /api/threads goes to routes/threads.js
app.use('/api/threads', threadsRouter)

// Every URL that starts with /api/invoices goes to routes/invoices.js
app.use('/api/invoices', invoicesRouter)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})