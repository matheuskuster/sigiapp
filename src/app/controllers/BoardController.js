const User = require('../models/User')
const QRCode = require('qrcode')

class BoardController {

  async index(req, res) {
    const page = req.query.page || 0

    const users = await User.find({ isCommitte: false, committe: req.params.id }).populate('delegation').skip(page*20).limit(20)

    const data = users.map(async user => {
      const url = await QRCode.toDataURL(
        `http://sigiapp.serra.ifes.edu.br/qrcode/${user._id}`, {
          color: {
            dark: '#36C1B6',
            light: '#0000'
          }
        }
      )

      return {
        access: {
          login: user.login,
          password: user.password,
          qrcode: url
        },
        delegation: {
          name: user.delegation.name,
          flag: user.delegation.flag
        }
      }
    })

    Promise.all(data).then(completed => {
      return res.render('board', {
        data: completed
      })
    })

  }
}

module.exports = new BoardController()
