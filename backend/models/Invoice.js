const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  date: String,
  dueDate: String,
  status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
})

module.exports = mongoose.model('Invoice', invoiceSchema)