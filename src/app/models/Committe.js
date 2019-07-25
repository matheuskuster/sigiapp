const mongoose = require('mongoose')

const Committe = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    organ: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organ'
    },
    startedAt: {
      type: Date,
      default: null
    },
    delegations: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Delegation', default: [] }
    ],
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List', default: [] }],
    schedule: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: [] }
    ],
    users: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Committe', Committe)
