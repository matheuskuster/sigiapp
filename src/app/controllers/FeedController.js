const User = require('../models/User')
const Organ = require('../models/Organ')
const Post = require('../models/Post')
const moment = require('moment')
moment.locale('pt-br')

class FileController {
  async index(req, res) {
    const result = await Post.find().populate(['user', 'organ']).sort('-createdAt')
    let organ = null

    if(req.session && req.session.user) {
      const user = await User.findById(req.session.user._id).populate('committe')

      if(user.committe == null && user.isAdmin == false) {
        return res.redirect('/app')
      }

      if(user.isCommitte) {
        organ = await Organ.findById(user.committe.organ)
      }

      res.locals.user = user
    }

    const posts = result.map(post => {
      return {
        content: post,
        date: moment(post.createdAt).fromNow()
      }
    })

    console.log(posts)

    return res.render('feed', { posts, organ })
  }

  async create(req, res) {
    if(req.body.text.length == 0) {
      return res.json({ error: 'You need to write something.' })
    }

    const user = await User.findById(req.session.user._id).populate('committe')

    if(user.isCommitte) {
      const organ = await Organ.findById(user.committe.organ)

      await Post.create({
        text: req.body.text,
        user: user._id,
        organ,
        year: user.committe.year
      })

      req.io.sockets.in('feed').emit('feed')

      return res.redirect('/')
    }

    await Post.create({
      text: req.body.text,
      user: user._id,
    })

    req.io.sockets.in('feed').emit('feed')

    return res.redirect('/')
  }

  async remove(req, res) {
    const id = req.params.id

    await Post.findByIdAndRemove(id, {
      useFindAndModify: false
    })

    return res.redirect('/')
  }
}

module.exports = new FileController()
