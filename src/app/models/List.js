const mongoose = require('mongoose')

const List = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: 'BASE'
    },
    lastUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('List', List)
