const Sheet = require('../models/Sheet')

class FileController {
  async showSheet (req, res) {
    const { id } = req.params

    const sheet = await Sheet.findById(id)

    if (!sheet) {
      return res.redirect(`/app`)
    }

    return res.redirect(`/sheets/${sheet.path}`)
  }
}

module.exports = new FileController()
