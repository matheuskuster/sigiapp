const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { login, password } = req.body

    const user = await User.findOne({ login })

    if (!user) {
      req.flash('error', 'Usuário não encontrado')
      return res.redirect('/login')
    }

    if(!user.isAdmin  && !user.isCommitte && !user.isDiplomata) {
      if(user.password != password) {
        req.flash('error', 'Senha incorreta')
        return res.redirect('/login')
      }
    } else if (!(await user.compareHash(password))) {
      req.flash('error', 'Senha incorreta')
      return res.redirect('/login')
    }

    req.session.user = user
    return res.redirect('/')
  }

  async qrcode (req, res) {
    const user = await User.findById(req.params.id)

    if (!user) {
      req.flash('error', 'Usuário não encontrado')
      return res.redirect('/login')
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
