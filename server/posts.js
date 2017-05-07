import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { collections } from '../imports/collections'
import { utils } from '../imports/utils'

// 全ての情報を公開する
Meteor.publish('posts', function (selector, options) {
  const self = this
  const userId = this.userId
  selector['thread'] = {$exists: false}
  options.sort = {createdAt: -1}
  const cursor = collections.posts.find(selector, options).observe({
    addedAt (res) {
      if (res.reply) {
        const reply = collections.posts.findOne(res.reply)
        if (reply) {
          res.reply = reply
        } else {
          res.reply = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (res.link) res.content = utils.replace.link(res.content)
      if (res.tags) res.content = utils.replace.tags(res.content)
      if (userId !== res.owner) delete res.owner
      delete res.addr
      self.added('posts', res._id, res)
    },
    changed (res) {
      if (res.reply) {
        const reply = collections.posts.findOne(res.reply)
        if (reply) {
          res.reply = reply
        } else {
          res.reply = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (res.link) res.content = utils.replace.link(res.content)
      if (res.tags) res.content = utils.replace.tags(res.content)
      if (userId !== res.owner) delete res.owner
      delete res.addr
      self.changed('posts', res._id, res)
    },
    removed (res) {
      self.removed('posts', res._id)
    }
  })
  self.ready()
  self.onStop(() => { cursor.stop() })
})
Meteor.methods({
  // レスを取得する
  'posts:fetch' (selector, options) {
    selector.thread = {$exists: false}
    options.sort = {createdAt: -1}
    if (selector.owner) {
      if (selector.owner !== this.userId) {
        selector.public = {$exists: true}
      }
    }
    const posts = collections.posts.find(selector, options).fetch()
    .map(post => {
      if (post.reply) {
        const reply = collections.posts.findOne(post.reply)
        if (reply) {
          post.reply = reply
        } else {
          post.reply = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (post.link) post.content = utils.replace.link(post.content)
      // if (post.tags) post.content = utils.replace.tags(post.content)
      if (this.userId !== post.owner) delete post.owner
      delete post.addr
      return post
    })
    return posts
  },
  // スレッドを取得する
  'posts:fetchOne' (selector, options) {
    const users = {}
    const post = collections.posts.findOne(selector, options)
    if (!post) return null
    if (post.reply) {
      const reply = collections.posts.find(post.reply, {limit: 1})
      if (reply) {
        post.reply = reply
      } else {
        post.reply = {
          content: 'この投稿は既に削除されています'
        }
      }
    }
    if (post.replies && post.replies[0]) {
      post.replies = collections.posts.find({_id: {$in: post.replies}}, {sort: {createdAt: -1}}).fetch()
      .map(reply => {
        if (reply.public) {
          if (!users[reply.owner]) {
            users[reply.owner] = Meteor.users.findOne(reply.owner)
          }
          const user = users[reply.owner]
          if (user) {
            reply.public = {
              username: user.username,
              name: user.profile.name,
              icon: user.icon
            }
          }
        }
        reply.content = utils.replace.link(reply.content)
        // reply.content = utils.replace.tags(reply.content)
        if (this.userId !== reply.owner) delete reply.owner
        delete reply.addr
        return reply
      })
    }
    if (post.network) {
      post.networkInfo = collections.networks.findOne(post.network, {fields: {name: 1}})
    }
    post.content = utils.replace.link(post.content)
    // post.content = utils.replace.tags(post.content)
    if (this.userId !== post.owner) delete post.owner
    // post.unique = Random.createWithSeeds(post.addr).id()
    delete post.addr
    return post
  },
  // 投稿を挿入する
  'posts:insert' (req) {
    const address = this.connection.clientAddress || '127.0.0.1'
    check(req.isPublic, Boolean)
    check(req.content, String)
    if (req.images) {
      check(req.images, Array)
      check(req.imagesDate, String)
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
  },
  // 投稿を削除する
  'posts:remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.posts.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    collections.posts.remove(req.postId)
    if (post.reply) {
      collections.posts.update(post.reply, {
        $pull: {replies: post._id}
      })
    }
    // ↓ ハッシュタグの削除
    if (post.tags) {
      post.tags.filter(tag => tag !== '').forEach(hashtag => {
        const tag = collections.tags.findOne({name: hashtag})
        if (tag) {
          if (tag.count < 2) {
            collections.tags.remove(tag._id)
          } else {
            collections.tags.update({name: hashtag}, {$inc: {count: -1}})
          }
        }
      })
    }
    // ↓ 画像の削除
    if (post.images && post.images[0]) {
      const image = post.images[0].full
      const imageMin = post.images[0].min
      if (image) {
        HTTP.del(Meteor.settings.public.api.post.image, {
          params: {
            name: image.replace(/\?.*$/, ''),
            name_min: imageMin.replace(/\?.*$/, ''),
            imagesDate: post.imagesDate,
            unique: 'DdcHJM68ksFbUA'
          }
        }, err => {
          if (err) throw new Meteor.Error('not', '画像の削除に失敗しました')
        })
      }
    }
    return 200
  },
  // リアクションを更新する
  'posts:updateReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.postId, String)
    check(req.name, String)
    if (req.name.includes('.')) {
      throw new Meteor.Error('not', 'ドットを含むことはできません')
    }
    const post = collections.posts.findOne(req.postId)
    if (post.reactions[req.name] === undefined) {
      const reactions = Object.keys(post.reactions)
      const nReactions = reactions.length
      if (nReactions === 1 && post.reactions[reactions[0]].length === 0) {
        if (req.name === '') {
          throw new Meteor.Error('not', '空のリアクションはダメです')
        }
        if (req.name.length > 10) {
          throw new Meteor.Error('not', '10文字以上のリアクションはダメです')
        }
        collections.posts.update(req.postId, {
          $unset: {['reactions.' + reactions[0]]: ''},
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      } else {
        collections.posts.update(req.postId, {
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      }
    } else if (post.reactions[req.name].indexOf(this.userId) !== -1) {
      const nReactions = Object.keys(post.reactions).length
      if (nReactions > 1 && post.reactions[req.name].length === 1) {
        collections.posts.update(req.postId, {
          $unset: {['reactions.' + req.name]: ''}
        })
      } else {
        if (post.reactions[req.name].length === 1 && req.name !== 'スキ') {
          collections.posts.update(req.postId, {
            $set: {['reactions.' + 'スキ']: []},
            $unset: {['reactions.' + req.name]: ''}
          })
        } else {
          collections.posts.update(req.postId, {
            $pull: {['reactions.' + req.name]: this.userId}
          })
        }
      }
    } else {
      collections.posts.update(req.postId, {
        $push: {['reactions.' + req.name]: this.userId}
      })
    }
    return collections.posts.findOne(req.postId, {
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
