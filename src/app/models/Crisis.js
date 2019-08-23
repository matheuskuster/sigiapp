const mongoose = require('mongoose')

const Crisis = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Crisis', Crisis)
