const User = require('../models/User')
const Organ = require('../models/Organ')
const Committe = require('../models/Committe')
const Delegation = require('../models/Delegation')
const Token = require('../models/Token')
const Topic = require('../models/Topic')
const Sheet = require('../models/Sheet')
const SheetController = require('../../config/sheet')
const crypto = require('crypto')

class CommitteController {
  async show (req, res) {
    const committes = await Committe.find().populate('delegations')

    return res.json(committes)
  }

  async index (req, res) {
    const user = await User.findOne({ login: req.session.user.login }).populate(
      'committe'
    )
    const organs = await Organ.find().sort('name')
    const delegations = await Delegation.find().sort('name')
    const tokens = await Token.find({ user: user._id, for: 0 })
    let hasDependency

    if (tokens.length > 0) {
      hasDependency = true
    } else {
      hasDependency = false
    }

    return res.render('dashboard', { user, organs, delegations, hasDependency })
  }

  async store (req, res) {
    const { id } = req.params
    const { organ_id, title, year } = req.body

    const user = await User.findById(id)
    const organ = await Organ.findById(organ_id)

    const committe = await Committe.create({ title, year, organ })
    user.committe = committe

    await user.save()
    return res.redirect('/app/dashboard')
  }

  async setDelegations (req, res) {
    const { id } = req.params
    const { delegations } = req.body

    const committe = await Committe.findById(id)

    delegations.map(async d => {
      committe.delegations.push(d)
    })

    await committe.save()

    return res.redirect('/app/dashboard')
  }

  async setSchedule (req, res) {
    const { topics } = req.body
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(user.committe)

    const schedule = topics.map(async topic => {
      return await Topic.create({
        name: topic.title,
        subTopics: topic.subtopics
      })
    })

    Promise.all(schedule).then(async completed => {
      committe.schedule = [...completed]

      await committe.save()
      return res.json(committe)
    })
  }

  async generateUsers (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(user.committe).populate('organ')

    const users = committe.delegations.map(async id => {
      const delegation = await Delegation.findById(id)

      const login = committe.organ.alias + committe.year + '.' + delegation.code

      const password =
        delegation.code + '.' + (await crypto.randomBytes(2).toString('hex'))

      return await User.create({
        login,
        password,
        committe,
        delegation,
        isCommitte: false,
        isAdmin: false
      })
    })

    Promise.all(users).then(async completed => {
      const sheet = await SheetController.createSheet(committe, completed)
      committe.users = true
      await committe.save()

      return res.json(sheet)
    })
  }

  async showUsers (req, res) {
    let user;

    if(req.session.user.isCommitte) {
      user = await User.findById(req.session.user._id)
    } else {
      user = await User.findById(req.params.id)
    }


    const delegates = await User.find({
      committe: user.committe,
      isCommitte: false
    }).populate('delegation')
    const sheet = await Sheet.findOne({ committe: user.committe })

    return res.render('users', { delegates, sheet })
  }

  async pushDelegations (req, res) {
    const { delegations } = req.body
    const committe = await Committe.findById(req.params.id)

    delegations.map(d => {
      committe.delegations.push(d)
    })

    await committe.save()
    return res.json(committe)
  }
}

module.exports = new CommitteController()
