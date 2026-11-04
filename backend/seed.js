require('dotenv').config()
const mongoose = require('mongoose')
const Invoice = require('./models/Invoice')
const Payment = require('./models/Payment')
const Landlord = require('./models/Landlord')
const Certificate = require('./models/Certificate')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  await Invoice.deleteMany({})
  await Payment.deleteMany({})
  await Landlord.deleteMany({})
  await Certificate.deleteMany({})

  await Invoice.create({
    invoiceId: 'INV-1024',
    customer: 'Ahmed Khan',
    date: 'October 21, 2026',
    dueDate: 'November 4, 2026',
    status: 'Unpaid',
    items: [
      { name: 'Boiler service', price: 4500 },
      { name: 'Pipe repair', price: 2500 },
    ],
  })

  await Landlord.create({
    token: 'abc123',
    name: 'Mr. Imran Ali',
    property: '14 Park Road, Leeds LS6 1AB',
  })

  await Certificate.insertMany([
    {
      certId: 'CP12-0412',
      landlordToken: 'abc123',
      type: 'CP12 Gas Safety Record',
      issued: '2026-01-10',
      expires: '2027-01-10',
      engineer: 'Okafor Plumbing & Heating',
    },
    {
      certId: 'EICR-0187',
      landlordToken: 'abc123',
      type: 'EICR Electrical Report',
      issued: '2024-11-05',
      expires: '2026-11-05',
      engineer: 'Okafor Plumbing & Heating',
    },
    {
      certId: 'CP12-0230',
      landlordToken: 'abc123',
      type: 'CP12 Gas Safety Record',
      issued: '2024-06-01',
      expires: '2025-06-01',
      engineer: 'Okafor Plumbing & Heating',
    },
  ])

  console.log('Seed done: invoice, landlord and 3 certificates created')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed error:', err.message)
  process.exit(1)
})