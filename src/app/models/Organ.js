const mongoose = require('mongoose')

const Organ = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    alias: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Organ', Organ)
