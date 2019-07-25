const Token = require('../models/Token')

class TokenController {
  async resolve (req, res) {
    const { token } = req.params

    if (!(await Token.findOne({ token: token }))) {
      return res.json({ error: 'Token already resolved or does not exists' })
    }

    await Token.findOneAndRemove({ token: token }, { useFindAndModify: false })

    return res.json({ success: 'Token resolved' })
  }
}

module.exports = new TokenController()
