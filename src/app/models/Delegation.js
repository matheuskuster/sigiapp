const mongoose = require('mongoose')

const Delegation = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    flag: {
      type: String,
      default: null
    },
    isCountry: {
      type: Boolean,
      default: false
    },
    englishName: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Delegation', Delegation)
