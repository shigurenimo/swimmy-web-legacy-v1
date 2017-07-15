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
    addedAt: (model) => {
      if (name !== 'thread' && model.replyId) {
        const reply = collections.posts.findOne(model.replyId, replyOptions)
        if (reply) {
          model.reply = reply
        } else {
          model.reply = {
            _id: model.replyId,
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (model.images) {
        model.imagePath =
          'https://storage.googleapis.com/' +
          Meteor.settings.private.googleCloud.bucket + '/' +
          utils.createPathFromDate(model.createdAt)
      }
      if (model.link) { model.content = utils.replace.link(model.content) }
      if (model.tags) { model.content = utils.replace.tags(model.content) }
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.added(namespace, model._id, model)
    },
    changed: (model) => {
      if (model.replyId) {
        const reply = collections.posts.findOne(model.replyId, replyOptions)
        if (reply) {
          model.reply = reply
        } else {
          model.reply = {
            _id: model.replyId,
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (model.link) { model.content = utils.replace.link(model.content) }
      if (model.tags) { model.content = utils.replace.tags(model.content) }
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.changed(namespace, model._id, model)
    },
    removed: (model) => {
      this.removed(namespace, model._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
