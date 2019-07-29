const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { login, password } = req.body

    const user = await User.findOne({ login })

    if (!user) {
      req.flash('error', 'Usuário não encontrado')
      return res.redirect('/')
    }

    if (!(await user.compareHash(password))) {
      req.flash('error', 'Senha incorreta')
      return res.redirect('/')
    }

    req.session.user = user

    return res.redirect('/app')
  }

  async create (req, res) {
    return res.render('login')
  }

  destroy (req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')
      return res.redirect('/')
    })
  }
}

module.exports = new SessionController()
