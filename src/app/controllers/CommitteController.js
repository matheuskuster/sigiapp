const User = require('../models/User')
const Organ = require('../models/Organ')
const Committe = require('../models/Committe')
const List = require('../models/List')
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
    let user

    if (req.session.user.isCommitte) {
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

  async removeDelegations (req, res) {
    const delegation = req.body.delegation
    const committe = await Committe.findById(req.params.id)

    const newDelegations = committe.delegations.filter(id => {
      return id != delegation
    })

    committe.delegations = [...newDelegations]
    await committe.save()

    return res.json(committe)
  }

  async controlPanel (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(user.committe).populate(['organ', 'lists'])
    let delegates = await User.find({
      isCommitte: false,
      isAdmin: false,
      committe: committe._id
    })
      .select(['_id', 'present', 'delegation'])
      .populate('delegation')

    delegates.sort((a,b) => (a.delegation.name > b.delegation.name) ? 1 : ((b.delegation.name > a.delegation.name) ? -1 : 0)); 

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
        if(d.delegation.isCountry) {
          presency.vc += 1
        }
      } else {
        presency.pv += 1
        if(d.delegation.isCountry) {
          presency.vc += 1
        }
      }
    })

    return res.render('panel', { user, committe, delegates, presency })
  }

  async call(req, res) {
    const data = req.body
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(user.committe)
    
    const result = Object.entries(data).map(async d => {
      const id = d[0].split('-')[1]
      const value = parseInt(d[1])
      
      const user = await User.findById(id)
      user.present = value
      await user.save()
    })

    Promise.all(result).then(async completed => {
      if (committe.lists.length == 0) {
        committe.lists = [await List.create({
          lastUser: null,
          users: []
        })]

        await committe.save()
      }

      return res.redirect('/app/panel')
    })
  }
}

module.exports = new CommitteController()
