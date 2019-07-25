require('dotenv').config()

const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const LokiStore = require('connect-loki')(session)

const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV != 'production'

    this.database()
    this.middlewares()
    this.views()
    this.routes()
  }

  database () {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.use(express.json({ urlencoded: true }))

    this.express.use(
      session({
        store: new LokiStore({
          path: path.resolve(__dirname, '..', 'tmp', 'sessions.db')
        }),
        secret: process.env.APP_SECRET,
        resave: false,
        saveUninitialized: true
      })
    )
  }

  views () {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      watch: this.isDev,
      express: this.express,
      autoescape: true
    })

    this.express.set('view engine', 'njk')
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
