const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true },
  landlordToken: { type: String, required: true, index: true },
  type: { type: String, required: true },
  issued: String,
  expires: String,
  engineer: String,
})

module.exports = mongoose.model('Certificate', certificateSchema)