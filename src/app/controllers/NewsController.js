const User = require('../models/User')
const News = require('../models/News')
const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId
moment.locale('pt-br')

class NewsController {
  async index(req, res) {
    if(req.session.user) {
      const user = await User.findById(req.session.user._id)
      res.locals.user = user
    }

    const news = await News.find({ see: true }).sort('-createdAt')

    const data = news.map(n => {
      return {
        content: n,
        date: moment(n.createdAt).format('L')
      }
    })

    return res.render('news', { data, controlPage: false })
  }

  async create(req, res) {
    if(!req.session.user.isDiplomata) {
      return res.json({ error: 'You do not have permission to post something' })
    }

    if(!req.body.name) {
      req.body.name = "Anônimo"
    }

    const news = await News.create(req.body)

    return res.redirect(`/app/edit?n=${news._id}`)
  }

  async edit(req, res) {
    if(!req.session.user.isDiplomata) {
      return res.json({ error: 'You do not have permission to edit something' })
    }

    const news = await News.findById(req.query.n)

    news.date = moment(news.createdAt).format('L')
    news.hour = moment(news.createdAt).add(3, 'hours').format('LT').replace(':', 'h')

    return res.render('edit', { news })
  }

  async update(req, res) {
    if(!req.session.user.isDiplomata) {
      return res.json({ error: 'You do not have permission to update something' })
    }

    const { subtitle, body } = req.body

    const news = await News.findById(req.params.id)

    news.lead = subtitle;
    news.body = body

    await news.save()

    return res.redirect('/app/diplomata')
  }

  async news(req, res) {
    let user = null

    if(req.session.user) {
      user = await User.findById(req.session.user._id)
      res.locals.user = user
    }

    if(!ObjectId.isValid(req.params.id)) {
      return res.render('404')
    }

    const news = await News.findById(req.params.id)

    if(!news || !news.see && (user == null || !user.isDiplomata)) {
      return res.render('404')
    }

    news.date = moment(news.createdAt).format('L')
    news.hour = moment(news.createdAt).add(3, 'hours').format('LT').replace(':', 'h')

    return res.render('news_model', { news })
  }

  async unseen(req, res) {
    if(!req.session.user.isDiplomata) {
      return res.json({ error: 'You do not have permission to access this page' })
    }

    const news = await News.find({ see: false }).sort('-updatedAt')

    const data = news.map(n => {
      return {
        content: n,
        date: moment(n.createdAt).format('L')
      }
    })

    return res.render('news', { data, controlPage: true })
  }

  async remove(req, res) {
    if(!req.session.user.isDiplomata) {
      return res.json({ error: 'You do not have permission to update something' })
    }

    const news = await News.findById(req.params.id)

    if(req.query.see == 'true') {
      news.see = true
      await news.save()
      return res.redirect('/news/' + req.params.id + '?see=true')
    }

    if(req.query.see == 'false') {
      news.see = false
      await news.save()
      return res.redirect('/news/' + req.params.id)
    }

    if(req.query.delete == 'true') {
      await news.remove()
    }

    return res.redirect('/news')
  }
}

module.exports = new NewsController()
