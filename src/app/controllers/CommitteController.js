const User = require('../models/User')
const Organ = require('../models/Organ')
const Committe = require('../models/Committe')
const List = require('../models/List')
const Delegation = require('../models/Delegation')
const Token = require('../models/Token')
const Topic = require('../models/Topic')
const Sheet = require('../models/Sheet')
const Crisis = require('../models/Crisis')
const Debate = require('../models/Debate')
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
    const committe = await Committe.findById(user.committe).populate([
      'organ',
      'lists',
      'crisis',
      'schedule',
      'debate'
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
        if (d.delegation.isCountry) {
          presency.vc += 1
        }
      }
    })

    return res.render('panel', { user, committe, delegates, presency })
  }

  async call (req, res) {
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
        committe.lists = [
          await List.create({
            lastUser: null,
            users: []
          })
        ]

        await committe.save()
      }

      req.io.sockets.in(committe._id).emit('reload')
      return res.redirect('/app/panel')
    })
  }

  async shutSession (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    if (committe.lists.length == 0) {
      return res
        .status(400)
        .json({ error: 'The committe does not have a running session.' })
    }

    committe.lists.forEach(async list => {
      await List.findByIdAndRemove(list, {
        useFindAndModify: true
      })
    })

    committe.lists = []

    if(committe.crisis != null) {
      await Crisis.findByIdAndRemove(committe.crisis._id, {
        useFindAndModify: true
      })
      committe.crisis = null
    }

    if(committe.debate != null) {
      await Debate.findByIdAndRemove(committe.debate._id, {
        useFindAndModify: true
      })
      committe.debate = null
    }
    
    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }

  async newList (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)
    const listName = req.body.name

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    committe.lists.unshift(
      await List.create({
        lastUser: null,
        users: [],
        name: listName
      })
    )

    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }

  async changeList (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.committe)
    const list = await List.findById(req.params.list)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    if (!committe.lists.includes(list._id.toString())) {
      return res.status(400).json({
        error: 'It appears the selected list does not belong to your committe.'
      })
    }

    const index = committe.lists.indexOf(list._id.toString())

    committe.lists.splice(index, 1)
    committe.lists.unshift(list)

    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }

  async crisis (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    if (committe.crisis != null) {
      return res
        .status(400)
        .json({ error: 'It seems that the committe is already in crisis.' })
    }

    committe.crisis = await Crisis.create({
      text: req.body.text,
      time: req.body.time
    })

    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }

  async endCrisis (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    if (committe.crisis == null) {
      return res
        .status(400)
        .json({ error: 'It seems that the committe is not in crisis.' })
    }

    await Crisis.findByIdAndRemove(committe.crisis._id)
    committe.crisis = null
    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }

  async scheduleView(req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    committe.showingSchedule = !committe.showingSchedule
    await committe.save()

    req.io.sockets.in(committe._id).emit('view_schedule')

    return res.redirect('/app/panel')
  }

  async project(req, res) {
    const committe = await Committe.findById(req.params.id).populate([
      'organ',
      'lists',
      'crisis',
      'schedule',
      'debate'
    ])
    const delegates = await User.find({
      isCommitte: false,
      isAdmin: false,
      committe: committe._id
    })
      .select(['_id', 'present', 'delegation'])
      .populate('delegation')

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
        if (d.delegation.isCountry) {
          presency.vc += 1
        }
      }
    })

    return res.render('project', { committe, presency })
  }

  async debate (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    if (committe.debate != null) {
      return res
        .status(400)
        .json({ error: 'It seems that the committe is already in debate.' })
    }

    committe.debate = await Debate.create({
      time: req.body.time
    })

    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }

  async endDebate (req, res) {
    const user = await User.findById(req.session.user._id)
    const committe = await Committe.findById(req.params.id)

    if (
      user.committe._id.toString() != committe._id.toString() ||
      !user.isCommitte
    ) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to execute this action.' })
    }

    if (committe.debate == null) {
      return res
        .status(400)
        .json({ error: 'It seems that the committe is not in debate.' })
    }

    await Debate.findByIdAndRemove(committe.debate._id)
    committe.debate = null
    await committe.save()

    req.io.sockets.in(committe._id).emit('reload')

    return res.redirect('/app/panel')
  }
}

module.exports = new CommitteController()
