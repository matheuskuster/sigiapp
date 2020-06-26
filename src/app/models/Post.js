const mongoose = require('mongoose')

const Post = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true
    },
    organ: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Organ',
      required: false
    },
    year: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Post', Post)
