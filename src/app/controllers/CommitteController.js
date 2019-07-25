const User = require('../models/User')
const Organ = require('../models/Organ')
const Committe = require('../models/Committe')
const Delegation = require('../models/Delegation')
const Topic = require('../models/Topic')

class CommitteController {
  async index (req, res) {
    const user = await User.findOne({ login: req.session.user.login }).populate(
      'committe'
    )
    const organs = await Organ.find().sort('name')
    const delegations = await Delegation.find().sort('name')

    return res.render('dashboard', { user, organs, delegations })
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

    console.log(committe + '\n')

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
}

module.exports = new CommitteController()
