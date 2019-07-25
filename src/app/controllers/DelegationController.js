const Delegation = require('../models/Delegation')
const Token = require('../models/Token')
const Committe = require('../models/Committe')
const crypto = require('crypto')
const mail = require('../../config/mail')

class DelegationController {
  async store (req, res) {
    const { code } = req.body

    if (await Delegation.findOne({ code })) {
      return res.status(400).json({ error: 'Delegation already exists' })
    }

    const delegation = await Delegation.create(req.body)

    return res.json(delegation)
  }

  async ask (req, res) {
    const { name } = req.params
    const user = req.session.user

    const token = await crypto.randomBytes(10).toString('hex')
    await Token.create({
      token,
      user
    })

    const committe = await Committe.findById(user.committe)

    await mail.sendDelegationAskMail(user, name, committe, token)

    return res.json({ name, committe })
  }
}

module.exports = new DelegationController()
