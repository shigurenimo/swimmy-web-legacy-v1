import { Meteor } from 'meteor/meteor'
import collections from '/collections'
import utils from '/lib/utils'

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
