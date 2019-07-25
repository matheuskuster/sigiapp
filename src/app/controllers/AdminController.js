const User = require('../models/User')

class AdminController {
  async index (req, res) {
    const users = await User.find({ isCommitte: true })
      .sort('-createdAt')
      .populate('committe')

    return res.render('admin', { users })
  }

  async storeUser (req, res) {
    const { email } = req.body

    if (await User.findOne({ login: email })) {
      return res.json({ error: 'User already exists' })
    }

    await User.create({
      login: email,
      password: process.env.DEFAULT_USER_PASSWORD,
      isCommitte: true,
      isAdmin: false
    })

    return res.redirect('/app/admin')
  }
}

module.exports = new AdminController()
