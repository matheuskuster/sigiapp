const express = require('express')

const controllers = require('./app/controllers')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')
const adminMiddleware = require('./app/middlewares/isAdmin')
const committeMiddleware = require('./app/middlewares/isCommitte')
const hasUsersMiddleware = require('./app/middlewares/hasUsers')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  next()
})

routes.use('/app', authMiddleware)
routes.use('/app/admin', adminMiddleware)
routes.use('/app/dashboard', committeMiddleware)

// NAVIGATION
routes.get('/', guestMiddleware, controllers.SessionController.create)
routes.get('/app', controllers.UserController.redirect)

// USER
routes.get('/user/index', controllers.UserController.index)
routes.get('/user/show/:id', controllers.UserController.show)
routes.post('/user/store', controllers.UserController.store)
routes.post('/app/user/update/:id', controllers.UserController.updatePassword)
routes.post('/app/user/remove/:id', controllers.UserController.remove)
routes.get('/app/speakers', controllers.UserController.speakers)

// SESSION
routes.post('/signin', controllers.SessionController.store)
routes.get('/app/logout', controllers.SessionController.destroy)

// ADMIN
routes.get('/app/admin', controllers.AdminController.index)
routes.post('/app/admin/user', controllers.AdminController.storeUser)

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

// SHEET
routes.get('/app/sheet/:id', controllers.FileController.showSheet)

module.exports = routes
