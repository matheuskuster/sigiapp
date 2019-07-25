module.exports = (req, res, next) => {
  if (req.session && req.session.user.isCommitte) {
    return next()
  }

  return res.redirect('/app')
}
