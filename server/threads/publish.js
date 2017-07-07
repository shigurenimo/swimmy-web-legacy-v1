import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'
import utils from '/lib/imports/utils'

Meteor.publish('threads', function (selector = {}, options = {}, name) {
  selector.content = {$ne: ''}

  if (name !== 'one') {
    selector['replies.0'] = {$exists: true}

    options.fields = {
      _id: 1,
      content: 1,
      owner: 1,
      reactions: 1,
      replies: 1,
      createdAt: 1,
      updatedAt: 1
    }

    options.sort = {updatedAt: -1}
  }

  const namespace = name ? 'threads.' + name : 'threads'

  const cursor = collections.posts.find(selector, options).observe({
    addedAt: (model) => {
      if (name === 'one') {
        if (model.replies && model.replies[0]) {
          model.replies = collections.posts.find({
            _id: {$in: model.replies}
          }, {
            fields: {
              _id: 1,
              content: 1,
              owner: 1,
              reactions: 1,
              extension: 1,
              createdAt: 1,
              updatedAt: 1
            },
            sort: {createdAt: -1}
          }).fetch()
          .map(reply => {
            if (reply.images) {
              reply.imagePath =
                Meteor.settings.public.storage.images +
                utils.createPathFromDate(reply.createdAt)
            }
            reply.content = utils.replace.link(reply.content)
            reply.content = utils.replace.tags(reply.content)
            if (this.userId !== reply.ownerId) {
              delete reply.ownerId
            }
            return reply
          })
        }
        if (model.images) {
          model.imagePath =
            Meteor.settings.public.storage.images +
            utils.createPathFromDate(model.createdAt)
        }
      }
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.added(namespace, model._id, model)
    },
    changed: (model) => {
      if (name === 'one') {
        if (model.replies && model.replies[0]) {
          model.replies = collections.posts.find({
            _id: {$in: model.replies}
          }, {
            fields: {
              _id: 1,
              content: 1,
              owner: 1,
              reactions: 1,
              extension: 1,
              createdAt: 1,
              updatedAt: 1
            },
            sort: {createdAt: -1}
          }).fetch()
          .map(reply => {
            if (reply.images) {
              reply.imagePath =
                Meteor.settings.public.storage.images +
                utils.createPathFromDate(reply.createdAt)
            }
            reply.content = utils.replace.link(reply.content)
            reply.content = utils.replace.tags(reply.content)
            if (this.userId !== reply.ownerId) {
              delete reply.ownerId
            }
            return reply
          })
        }
        if (model.images) {
          model.imagePath =
            Meteor.settings.public.storage.images +
            utils.createPathFromDate(model.createdAt)
        }
      }
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.changed(namespace, model._id, model)
    },
    removed: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.removed(namespace, model._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
