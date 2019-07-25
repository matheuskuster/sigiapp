const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { login, password } = req.body

    const user = await User.findOne({ login })

    if (!user) {
      return res.redirect('/')
    }

    if (!(await user.compareHash(password))) {
      console.log('Senha incorreta')
      return res.redirect('/')
    }

    req.session.user = user

    return res.redirect('/app')
  }

  async create (req, res) {
    return res.render('login')
  }
}

module.exports = new SessionController()
