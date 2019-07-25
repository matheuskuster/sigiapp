const mongoose = require('mongoose')

const List = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 0
    },
    lastDelegation: { type: mongoose.Schema.Types.ObjectId, ref: 'Delegation' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('List', List)
