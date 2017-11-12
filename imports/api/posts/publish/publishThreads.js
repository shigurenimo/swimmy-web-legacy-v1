import { Meteor } from 'meteor/meteor'

import { Posts } from '/imports/collection'

Meteor.publish('threads', function (selector = {}, options = {}, scope) {
  selector.content = {$ne: ''}
  selector['repliedPostIds.0'] = {$exists: true}

  options.sort = {createdAt: -1}
  options.limit = 50

  const firstModel = Posts.findOne(selector, options)

  const target = scope ? 'threads.' + scope : 'threads'

  if (firstModel) {
    if (this.userId !== firstModel.ownerId) { delete firstModel.ownerId }
    this.added(target, firstModel._id, firstModel)
  }

  const cursor = Posts.find(selector, options).observe({
    addedAt: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.added(target, model._id, model)
    },
    changed: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.changed(target, model._id, model)
    },
    removed: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.removed(target, model._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
