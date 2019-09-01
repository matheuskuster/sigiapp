const express = require('express')

const controllers = require('./app/controllers')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')
const adminMiddleware = require('./app/middlewares/isAdmin')
const committeMiddleware = require('./app/middlewares/isCommitte')
const notDelegateMiddleware = require('./app/middlewares/notDelegate')
const isDelegateMiddlewate = require('./app/middlewares/isDelegate')
const hasUsersMiddleware = require('./app/middlewares/hasUsers')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  next()
})

routes.use('/app', authMiddleware)
routes.use('/app/admin', adminMiddleware)
routes.use('/app/dashboard', committeMiddleware)
routes.use('/app/users', notDelegateMiddleware)
routes.use('/app/speakers', isDelegateMiddlewate)

// FEED
routes.get('/', controllers.FeedController.index)
routes.post('/app/feed/create', controllers.FeedController.create)
routes.get('/app/feed/remove/:id', controllers.FeedController.remove)

// NAVIGATION
routes.get('/login', guestMiddleware, controllers.SessionController.create)
routes.get('/app', controllers.UserController.redirect)

// USER
routes.get('/user/index', controllers.UserController.index)
routes.get('/user/show/:id', controllers.UserController.show)
routes.post('/user/store', controllers.UserController.store)
routes.post('/app/user/update/:id', controllers.UserController.updatePassword)
routes.post('/app/user/remove/:id', controllers.UserController.remove)
routes.get('/app/speakers', controllers.UserController.speakers)
routes.get('/app/user/:id', controllers.UserController.information)
routes.get('/app/profile', controllers.UserController.profile)
routes.get('/users/erase/:id', controllers.UserController.eraseDelegatesUserFromCommitte)

// SESSION
routes.post('/signin', controllers.SessionController.store)
routes.get('/app/logout', controllers.SessionController.destroy)
routes.get('/qrcode/:id', controllers.SessionController.qrcode)

// ADMIN
routes.get('/app/admin', controllers.AdminController.index)
routes.post('/app/admin/user', controllers.AdminController.storeUser)
routes.get('/app/users/:id', controllers.CommitteController.showUsers)

// COMMITTE
routes.get('/app/dashboard', controllers.CommitteController.index)
routes.post('/app/committe/store/:id', controllers.CommitteController.store)
routes.post(
  '/app/committe/delegations/:id',
  controllers.CommitteController.setDelegations
)
routes.post(
  '/app/committe/schedule',
  controllers.CommitteController.setSchedule
)
routes.get('/app/committe/users', controllers.CommitteController.generateUsers)
routes.get(
  '/app/users',
  hasUsersMiddleware,
  controllers.CommitteController.showUsers
)
routes.post(
  '/committe/delegations/push/:id',
  controllers.CommitteController.pushDelegations
)
routes.get('/committes', controllers.CommitteController.show)
routes.post(
  '/committe/delegations/remove/:id',
  controllers.CommitteController.removeDelegations
)
routes.get('/app/panel', controllers.CommitteController.controlPanel)
routes.post('/app/call', controllers.CommitteController.call)
routes.get('/app/shutsession/:id', controllers.CommitteController.shutSession)
routes.post('/app/newlist/:id', controllers.CommitteController.newList)
routes.get(
  '/app/changelist/:committe/:list',
  controllers.CommitteController.changeList
)
routes.post('/app/crisis/:id', controllers.CommitteController.crisis)
routes.get('/app/endcrisis/:id', controllers.CommitteController.endCrisis)
routes.get('/app/scheduleview/:id', controllers.CommitteController.scheduleView)
routes.get('/view/:id', controllers.CommitteController.project)
routes.post('/app/debate/:id', controllers.CommitteController.debate)
routes.get('/app/enddebate/:id', controllers.CommitteController.endDebate)

// ORGAN
routes.post('/organ/store', controllers.OrganController.store)
routes.get('/organ/index', controllers.OrganController.index)

// DELEGATION
routes.post('/delegation/store', controllers.DelegationController.store)
routes.post(
  '/delegation/remove/:alias',
  controllers.DelegationController.remove
)
routes.get('/app/delegation/ask/:name', controllers.DelegationController.ask)
routes.get('/delegations', controllers.DelegationController.index)
routes.post('/delegation/update/:id', controllers.DelegationController.update)

// TOKEN
routes.get('/resolve/:token', controllers.TokenController.resolve)
routes.get('/tokens', controllers.TokenController.show)

// SHEET
routes.get('/app/sheet/:id', controllers.FileController.showSheet)

// LIST
routes.get('/list/:id', controllers.ListController.getList)
routes.get('/list/next/:id', controllers.ListController.next)
routes.get('/list/previous/:id', controllers.ListController.previous)
routes.get('/list/push/:user_id/:id', controllers.ListController.push)

routes.get('/about', (req, res) => {
  return res.render('development')
})


// NEWS
routes.get('/news', controllers.NewsController.index)
routes.get('/news/:id', controllers.NewsController.news)
routes.post('/app/news/post', controllers.NewsController.create)
routes.get('/app/edit', controllers.NewsController.edit)
routes.post('/app/edit/:id', controllers.NewsController.update)
routes.get('/app/diplomata', controllers.NewsController.unseen)
routes.get('/app/diplomata/:id', controllers.NewsController.remove)

// GERADOR DE PLACAS
routes.get('/board/:id', controllers.BoardController.index)

module.exports = routes
