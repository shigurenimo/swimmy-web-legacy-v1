import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.publish('threads', function (selector = {}, options = {}, target) {
  selector.content = {$ne: ''}
  selector['replies.0'] = {$exists: true}

  options.limit = 50

  const firstModel = collection.posts.findOne(selector, options)

  if (firstModel) {
    if (this.userId !== firstModel.ownerId) { delete firstModel.ownerId }
    this.added(target, firstModel._id, firstModel)
  }

  const cursor = collection.posts.find(selector, options).observe({
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
