const User = require('../models/User')
const Committe = require('../models/Committe')
const QRCode = require('qrcode')

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
    if(req.session.user.isDiplomata) {
      return res.redirect('/news')
    }

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

  async speakers (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(user.committe).populate([
      'organ',
      'list',
      'debate',
      'schedule'
    ])
    const delegates = await User.find({
      isCommitte: false,
      isAdmin: false,
      committe: committe._id
    })
      .select(['_id', 'present', 'delegation'])
      .populate('delegation')

    delegates.sort((a, b) =>
      a.delegation.name > b.delegation.name
        ? 1
        : b.delegation.name > a.delegation.name
          ? -1
          : 0
    )

    const presency = {
      p: 0,
      pv: 0,
      a: 0,
      vc: 0
    }

    delegates.map(d => {
      if (d.present == 0) {
        presency.a += 1
      } else if (d.present == 1) {
        presency.p += 1
        if (d.delegation.isCountry) {
          presency.vc += 1
        }
      } else {
        presency.pv += 1
      }
    })

    return res.render('speakers', { user, committe, delegates, presency })
  }

  async information (req, res) {
    const user = await User.findById(req.params.id).populate('delegation')

    const url = await QRCode.toDataURL(
      `http://sigiapp.serra.ifes.edu.br/qrcode/${req.params.id}`
    )

    return res.render('information', { url, user })
  }

  async eraseDelegatesUserFromCommitte (req, res) {
    const { id } = req.params
    const { token } = req.body
    const committe = Committe.findById(id)

    if (token != process.env.ADMIN_TOKEN) {
      return res.json({ error: 'Invalid admin token' })
    }

    await User.deleteMany({ committe: committe._id, isCommitte: false })
    committe.users = false
    await committe.save()

    return res.json({
      success: `Users from ${committe.title} were all deleted`
    })
  }

  async profile(req, res) {
    const user = await User.findById(req.session.user._id).populate(['delegation', 'committe'])
    let committe = null

    if(user.isCommitte || (!user.isAdmin && !user.isDiplomata && !user.isStaff)) {
      committe = await Committe.findById(user.committe._id).populate('organ')
    }

    return res.render('profile', { user, committe })
  }
}

module.exports = new UserController()
