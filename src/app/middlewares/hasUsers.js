const User = require('../models/User')

module.exports = async (req, res, next) => {
  const user = await User.findById(req.session.user._id).populate('committe')

  if (user.committe.users) {
    return next()
  }

  return res.redirect('/app')
}
