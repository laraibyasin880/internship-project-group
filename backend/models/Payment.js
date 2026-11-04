const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  invoiceId: { type: String, required: true },
  amount: { type: Number, required: true },
  brand: String,
  last4: String,
  email: String,
  date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Payment', paymentSchema)