const List = require('../models/List')
const Committe = require('../models/Committe')
const User = require('../models/User')

class ListController {
  async getList(req, res) {
    const committe = await Committe.findById(req.params.id)
    const list = await List.findById(committe.lists[0]).populate('users')

    const delegations = list.users.map(async user => {
      return await User.findById(user._id).populate('delegation')
    })

    Promise.all(delegations).then(async completed => {
      return res.json(completed)
    })    
  }

  async next(req, res) {
    const committe = await Committe.findById(req.params.id)
    const list = await List.findById(committe.lists[0])
    list.lastUser = list.users[0]
    list.users.shift()
    await list.save()

    return res.json(list)
  }

  async previous(req, res) {
    const committe = await Committe.findById(req.params.id)
    const list = await List.findById(committe.lists[0])

    if (list.lastUser == null) {
      return res.status(400)
    }

    list.users.unshift(list.lastUser)
    list.lastUser = null

    await list.save()

    return res.json(list)
  }

  async push(req, res) {
    const committe = await Committe.findById(req.params.id)
    const user = await User.findById(req.params.user_id)
    const list = await List.findById(committe.lists[0])

    list.users.push(user)

    console.log(list)

    await list.save()

    return res.json(list)
  }
    
}

module.exports = new ListController()


