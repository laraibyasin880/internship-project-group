const express = require('express')
const router = express.Router()
const Invoice = require('../models/Invoice')
const Payment = require('../models/Payment')

function getTotal(invoice) {
  return invoice.items.reduce((sum, item) => sum + item.price, 0)
}

function toResponse(invoice) {
  return {
    id: invoice.invoiceId,
    customer: invoice.customer,
    date: invoice.date,
    dueDate: invoice.dueDate,
    status: invoice.status,
    items: invoice.items.map((i) => ({ name: i.name, price: i.price })),
    total: getTotal(invoice),
  }
}

router.get('/:invoiceId', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.invoiceId })
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    res.json(toResponse(invoice))
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/:invoiceId/pay', async (req, res) => {
  try {
    const { brand, last4, email } = req.body

    if (!brand || !/^\d{4}$/.test(last4 || '')) {
      return res.status(400).json({ message: 'Card brand and last 4 digits are required' })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email is required' })
    }

    // Sirf Unpaid invoice ko Paid karta hai, taake do baar payment na ho
    const invoice = await Invoice.findOneAndUpdate(
      { invoiceId: req.params.invoiceId, status: 'Unpaid' },
      { status: 'Paid' },
      { new: true }
    )

    if (!invoice) {
      const exists = await Invoice.exists({ invoiceId: req.params.invoiceId })
      if (!exists) {
        return res.status(404).json({ message: 'Invoice not found' })
      }
      return res.status(400).json({ message: 'This invoice is already paid' })
    }

    const payment = await Payment.create({
      transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      invoiceId: invoice.invoiceId,
      amount: getTotal(invoice),
      brand,
      last4,
      email,
    })

    res.status(201).json({
      id: payment.transactionId,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      brand: payment.brand,
      last4: payment.last4,
      email: payment.email,
      date: payment.date,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router