import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'
import utils from '/lib/imports/utils'

Meteor.publish('posts', function (selector = {}, options = {}, name) {
  switch (name) {
    case 'self':
      selector.ownerId = this.userId
      break
    case 'follows':
      const user = Meteor.users.findOne(this.userId)
      selector['ownerId'] = {$in: user.profile.follows}
      break
  }

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

  const namespace = name ? 'posts.' + name : 'posts'

  const cursor = collections.posts.find(selector, options).observe({
    addedAt: (post) => {
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
      if (this.userId !== post.ownerId) { delete post.ownerId }
      this.added(namespace, post._id, post)
    },
    changed: (post) => {
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
      if (this.userId !== post.ownerId) { delete post.ownerId }
      this.changed(namespace, post._id, post)
    },
    removed: (post) => {
      this.removed(namespace, post._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
