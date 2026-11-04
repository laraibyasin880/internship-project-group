const mongoose = require('mongoose')

const landlordSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  property: String,
})

module.exports = mongoose.model('Landlord', landlordSchema)