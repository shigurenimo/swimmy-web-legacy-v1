import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { HTTP } from 'meteor/http'
import collections from '/collections'
import utils from '/utils'

Meteor.methods({
  'posts.insert' (req) {
    const address = this.connection.clientAddress || '127.0.0.1'
    check(req.isPublic, Boolean)
    check(req.content, String)
    if (req.images) {
      check(req.images, Array)
      check(req.imagesDate, String)
    }
    if (!req.images && req.content.length < 1) {
      throw new Meteor.Error('ignore', '入力がありません')
    }
    const url = utils.match.url(req.content)
    // ↓ oEmbed
    let service = null
    if (url) {
      if (url.match(new RegExp('youtube.com'))) {
        service = 'http://www.youtube.com/oembed'
      } else if (url.match(new RegExp('youtu.be'))) {
        service = 'http://www.youtube.com/oembed'
      } else if (url.match(new RegExp('flickr.com'))) {
        service = 'http://www.flickr.com/services/oembed'
      } else if (url.match(new RegExp('flic.kr'))) {
        service = 'http://www.flickr.com/services/oembed'
      } else if (url.match(new RegExp('vimeo.com'))) {
        service = 'http://vimeo.com/api/oembed.json'
      } else if (url.match(new RegExp('slideshare.net'))) {
        service = 'http://www.slideshare.net/api/oembed/2'
      } else if (url.match(new RegExp('soundcloud.com'))) {
        service = 'http://soundcloud.com/oembed'
      } else if (url.match(new RegExp('vine.co'))) {
        service = 'https://vine.co/oembed.json'
      }
    }
    let oEmbed = null
    let web = null
    if (service) {
      oEmbed = oEmbedAsync(url, service)
    } else if (url) {
      web = webAsync(url)
    }
    const data = {
      addr: address,
      content: req.content,
      reactions: {'スキ': []},
      replies: [],
      from: 'swimmy',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const tags = utils.match.tags(req.content)
    if (tags) data.tags = tags
    if (this.userId) data.owner = this.userId
    if (req.isPublic) {
      if (!this.userId) throw new Meteor.Error('not-authorized')
      const user = Meteor.users.findOne(this.userId)
      data.public = {
        username: user.username,
        name: user.profile.name,
        icon: ''
      }
    }
    Object.keys(req).forEach(name => {
      switch (name) {
        case 'images':
          data.images = req.images
          data.imagesDate = req.imagesDate
          break
        case 'reply':
          check(req.reply, String)
          data.reply = req.reply
          break
        case 'network':
          check(req.network, String)
          data.network = req.network
          break
      }
    })
    if (url) data.url = url
    if (web) data.web = web
    if (oEmbed) data.oEmbed = oEmbed
    // ↓ 更新
    const postId = collections.posts.insert(data)
    if (req.reply) {
      collections.posts.update(req.reply, {
        $push: {replies: postId},
        $set: {updatedAt: new Date()}
      })
    }
    // ↓ タグの更新
    if (tags) {
      tags.filter(tag => tag !== '').forEach(hashtag => {
        const tag = collections.tags.findOne({name: hashtag})
        if (tag) {
          collections.tags.update(tag._id, {
            $set: {updatedAt: new Date()},
            $inc: {count: 1}
          })
        } else {
          collections.tags.insert({
            name: hashtag,
            updatedAt: new Date(),
            createdAt: new Date(),
            count: 1,
            thread: false,
            threads: []
          })
        }
      })
    }
    return collections.posts.findOne(postId, {
      fields: {
        owner: 0,
        addr: 0
      }
    })
  }
})

const oEmbedAsync = Meteor.wrapAsync((url, service, resolve) => {
  HTTP.get(service, {
    params: {url: url, format: 'json'}
  }, (err, res) => {
    if (err) {
      resolve(null, null)
    } else {
      resolve(null, res.data)
    }
  })
})

const webAsync = Meteor.wrapAsync((url, resolve) => {
  const cheerio = require('cheerio')
  HTTP.get(url, (err, res) => {
    if (err) {
      resolve(null, null)
      return
    }
    const $ = cheerio.load(res.content, {decodeEntities: false})
    const title = $('title').text()
    const description = $('meta[name=description]')[0]
      ? $('meta[name=description]')[0].attribs.content
      : ''
    const metaData = $('meta')
    const meta = {}
    metaData.each(function () {
      const attribs = $(this)[0].attribs
      const propery = attribs.property
      if (propery && propery.includes('og:')) {
        meta[propery] = attribs.content
      }
    })
    const html = {
      title: title,
      description: description,
      meta: meta
    }
    resolve(null, html)
  })
})
