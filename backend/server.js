require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())
const invoiceRoutes = require('./routes/invoices')
app.use('/api/invoices', invoiceRoutes)
const landlordRoutes = require('./routes/landlord')
app.use('/api/landlord', landlordRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
  })
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))