const mongoose = require('mongoose')

const Debate = new mongoose.Schema({
    time: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Debate', Debate)
