import { Meteor } from 'meteor/meteor'

import collection from '/imports/collection'
import createPathFromDate from '/imports/utils/createPathFromDate'
import replaceLink from '/imports/utils/replaceLink'

Meteor.publish('posts', function (selector = {}, options = {}, scope) {
  switch (scope) {
    case 'self':
      selector.ownerId = this.userId
      break
    case 'follows':
      const user = Meteor.users.findOne(this.userId)
      selector['ownerId'] = {$in: user.profile.follows}
      break
  }

  if (selector.content) {
    if (selector.content.slice(-1) === '/' && selector.content.slice(0, 1) === '/') {
      selector.content = new RegExp(selector.content.replace(new RegExp('/', 'g'), ''), 'g')
    }
  }

  options.sort = {createdAt: -1}
  options.fields = {
    replies: 0
  }
  options.limit = 40

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

  const firstModel = collection.posts.findOne(selector, options)

  const target = scope ? 'posts.' + scope : 'posts'

  if (firstModel) {
    if (scope !== 'thread' && firstModel.replyId) {
      const reply = collection.posts.findOne(firstModel.replyId, replyOptions)
      if (reply) {
        firstModel.reply = reply
      } else {
        firstModel.reply = {
          _id: firstModel.replyId,
          content: 'この投稿は既に削除されています'
        }
      }
    }
    if (firstModel.images) {
      firstModel.imagePath =
        'https://storage.googleapis.com/' +
        Meteor.settings.private.googleCloud.bucket + '/' +
        createPathFromDate(firstModel.createdAt)
    }
    if (firstModel.link) { firstModel.content = replaceLink(firstModel.content) }
    if (this.userId !== firstModel.ownerId) { delete firstModel.ownerId }
    this.added(target, firstModel._id, firstModel)
  }

  const cursor = collection.posts.find(selector, options)

  const observeHandle = cursor.observe({
    addedAt: (model) => {
      if (scope !== 'thread' && model.replyId) {
        const reply = collection.posts.findOne(model.replyId, replyOptions)
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
          createPathFromDate(model.createdAt)
      }
      if (model.link) { model.content = replaceLink(model.content) }
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.added(target, model._id, model)
    },
    changed: (model) => {
      if (model.replyId) {
        const reply = collection.posts.findOne(model.replyId, replyOptions)
        if (reply) {
          model.reply = reply
        } else {
          model.reply = {
            _id: model.replyId,
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (model.link) { model.content = replaceLink(model.content) }
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.changed(target, model._id, model)
    },
    removed: (model) => {
      this.removed(target, model._id)
    }
  })

  this.ready()

  this.onStop(() => { observeHandle.stop() })
})
