const Delegation = require('../models/Delegation')
const Token = require('../models/Token')
const User = require('../models/User')
const Committe = require('../models/Committe')
const crypto = require('crypto')
const mail = require('../../config/mail')

class DelegationController {
  async index (req, res) {
    const delegations = await Delegation.find()

    return res.json(delegations)
  }

  async remove (req, res) {
    const { alias } = req.params
    const { token } = req.body

    if (token == process.env.ADMIN_TOKEN) {
      const delegation = await Delegation.findOneAndRemove({ code: alias })
      return res.json(delegation)
    }

    return res.json({ error: 'Invalid admin token' })
  }

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
    const user = await User.findById(req.session.user._id)

    const token = await crypto.randomBytes(10).toString('hex')
    await Token.create({
      token,
      user,
      delegation: name
    })

    const committe = await Committe.findById(user.committe)

    await mail.sendDelegationAskMail(user, name, committe, token)

    return res.json({ name, committe })
  }

  async update (req, res) {
    const delegation = await Delegation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    return res.json(delegation)
  }

  async fixDelegations () {
    const delegations = await Delegation.find()

    delegations.map(async d => {
      if (d.flag.indexOf('assets') != -1) {
        d.flag = d.flag.replace('..', '')
        await d.save()
      }
    })
  }
}

module.exports = new DelegationController()
