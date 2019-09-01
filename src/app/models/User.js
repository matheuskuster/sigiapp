const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Committe = require('./Committe')

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
    isStaff: {
      type: Boolean,
      default: false
    },
    isDiplomata: {
      type: Boolean,
      default: false
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
    },
    present: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

User.pre('save', async function (next) {
  if (!this.isModified('password') || (!this.isCommitte && !this.isAdmin && !this.isDiplomata)) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

User.pre('remove', async function (next) {
  if (this.committe != null) {
    const committe = await Committe.findById(this.committe)
    await committe.remove()
  }

  next()
})

User.methods = {
  compareHash (password) {
    if (!this.isCommitte && !this.isAdmin && !this.isDiplomata) {
      return true
    }

    return bcrypt.compare(password, this.password)
  }
}

User.plugin(require('mongoose-paginate'))

module.exports = mongoose.model('User', User)
