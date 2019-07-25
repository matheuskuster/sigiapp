const Organ = require('../models/Organ')

class OrganController {
  async index (req, res) {
    const organs = await Organ.find()

    return res.json(organs)
  }

  async store (req, res) {
    const { alias } = req.body

    if (await Organ.findOne({ alias: alias })) {
      return res.json({ error: 'Organ already exists' })
    }

    const organ = await Organ.create(req.body)

    return res.json(organ)
  }
}

module.exports = new OrganController()
