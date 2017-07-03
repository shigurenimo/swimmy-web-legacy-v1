import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'
import utils from '/lib/imports/utils'

Meteor.publish('posts', function (selector, options) {
  const self = this
  const userId = this.userId

  options.sort = {createdAt: -1}
  options.fields = {
    replies: 0
  }

  const replyOptions = {
    fields: {
      _id: 1,
      content: 1,
      owner: 1,
      reactions: 1,
      extension: 1,
      createdAt: 1,
      updatedAt: 1
    }
  }

  const cursor = collections.posts.find(selector, options).observe({
    addedAt (post) {
      if (post.replyId) {
        const reply = collections.posts.findOne(post.replyId, replyOptions)
        if (reply) {
          post.reply = reply
        } else {
          post.reply = {
            _id: post.replyId,
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (post.images) {
        post.imagePath =
          Meteor.settings.public.storage.images +
          utils.createPathFromDate(post.createdAt)
      }
      if (post.link) { post.content = utils.replace.link(post.content) }
      // if (post.tags) { post.content = utils.replace.tags(post.content) }
      if (userId !== post.ownerId) { delete post.ownerId }
      self.added('posts', post._id, post)
    },
    changed (post) {
      if (post.replyId) {
        const reply = collections.posts.findOne(post.replyId, replyOptions)
        if (reply) {
          post.reply = reply
        } else {
          post.reply = {
            _id: post.replyId,
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
