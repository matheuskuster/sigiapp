const mongoose = require('mongoose')

const Token = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    for: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Token', Token)
