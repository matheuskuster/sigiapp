const mongoose = require('mongoose')

const Sheet = new mongoose.Schema(
  {
    committe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Committe',
      default: null
    },
    path: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Sheet', Sheet)
