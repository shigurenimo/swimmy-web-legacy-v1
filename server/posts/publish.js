import { Meteor } from 'meteor/meteor'
import collections from '/collections'
import utils from '/lib/utils'

Meteor.publish('posts', function (selector, options) {
  const self = this
  const userId = this.userId

  options.sort = {createdAt: -1}

  const cursor = collections.posts.find(selector, options).observe({
    addedAt (post) {
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
      if (post.link) { post.content = utils.replace.link(post.content) }
      // if (post.tags) { post.content = utils.replace.tags(post.content) }
      if (userId !== post.ownerId) {
        delete post.ownerId
      }
      self.added('posts', post._id, post)
    },
    changed (post) {
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
      if (post.link) { post.content = utils.replace.link(post.content) }
      // if (post.tags) { post.content = utils.replace.tags(post.content) }
      if (userId !== post.ownerId) { delete post.ownerId }
      self.changed('posts', post._id, post)
    },
    removed (post) {
      self.removed('posts', post._id)
    }
  })

  self.ready()

  self.onStop(() => { cursor.stop() })
})
