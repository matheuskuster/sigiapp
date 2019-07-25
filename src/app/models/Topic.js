const mongoose = require('mongoose')

const Topic = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    subTopics: [{ type: String, required: true }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Topic', Topic)
