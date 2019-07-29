const User = require('../models/User')

class UserController {
  async index (req, res) {
    const users = await User.find()

    return res.json(users)
  }

  async store (req, res) {
    const { login } = req.body

    if (await User.findOne({ login })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }

  async redirect (req, res) {
    if (req.session.user.isAdmin) {
      return res.redirect('/app/admin')
    }

    if (req.session.user.isCommitte) {
      return res.redirect('/app/dashboard')
    }

    return res.redirect('/app/speakers')
  }

  async updatePassword (req, res) {
    const { id } = req.params
    const { password } = req.body

    const user = await User.findById(id)
    user.password = password
    user.firstAccess = false
    await user.save()

    return res.redirect('/app/dashboard')
  }

  async show (req, res) {
    const { id } = req.params

    const user = await User.findById(id)

    return res.json(user)
  }

  async remove (req, res) {
    const { id } = req.params

    const user = await User.findById(id)
    user.remove()

    return res.redirect('/app')
  }
}

module.exports = new UserController()
