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
    crisis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crisis',
      default: null
    },
    showingSchedule: {
      type: Boolean,
      default: false
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

Committe.pre('remove', async function (next) {
  const User = require('./User')

  if (this.users) {
    await User.deleteMany({ committe: this._id, isCommitte: false })
  }

  next()
})

module.exports = mongoose.model('Committe', Committe)
