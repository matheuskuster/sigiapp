const mongoose = require('mongoose')

const News = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    lead: {
      type: String,
      required: false
    },
    body: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    bodyImage: {
      type: String,
      required: false
    },
    see: {
      type: Boolean,
      default: false
    },
    kind: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('News', News)
