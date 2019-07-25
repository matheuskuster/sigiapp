const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    committe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Committe',
      default: null
    },
    delegation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delegation',
      default: null
    },
    isCommitte: {
      type: Boolean,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    firstAccess: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

User.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

User.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

module.exports = mongoose.model('User', User)
