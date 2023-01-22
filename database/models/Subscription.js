const mongoose = require('mongoose')

const Schema = mongoose.Schema

const subSchema = new Schema({
  type: String,
  status: String,
  updatedAt: Date,
})

module.exports = mongoose.model('subsciption', subSchema)
