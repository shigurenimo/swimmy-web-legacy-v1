import { Meteor } from 'meteor/meteor'

import createPathFromDate from '/imports/utils/createPathFromDate'
import replaceLink from '/imports/utils/replaceLink'
import { Posts } from '/imports/collection'

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
    repliedPostIds: 0
  }
  options.limit = 80

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

  const firstModel = Posts.findOne(selector, options)

  const target = scope ? 'posts.' + scope : 'posts'

  if (firstModel) {
    if (scope !== 'thread' && firstModel.replyPostId) {
      const replyPost = Posts.findOne(firstModel.replyPostId, replyOptions)
      if (replyPost) {
        firstModel.replyPost = replyPost
      } else {
        firstModel.replyPost = {
          _id: firstModel.replyPostId,
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

  const cursor = Posts.find(selector, options)

  const observeHandle = cursor.observe({
    addedAt: (model) => {
      if (scope !== 'thread' && model.replyPostId) {
        const replyPost = Posts.findOne(model.replyPostId, replyOptions)
        if (replyPost) {
          model.replyPost = replyPost
        } else {
          model.replyPost = {
            _id: model.replyPostId,
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
      if (model.replyPostId) {
        const replyPost = Posts.findOne(model.replyPostId, replyOptions)
        if (replyPost) {
          model.replyPost = replyPost
        } else {
          model.replyPost = {
            _id: model.replyPostId,
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
