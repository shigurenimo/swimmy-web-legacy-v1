import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.publish('buckets', function (selector, options, target) {
  const firstModel = collection.buckets.findOne(selector, options)

  if (firstModel) {
    this.added(target, firstModel._id, firstModel)
  }

  const cursor = collection.buckets.find(selector, options)
  .observe({
    addedAt: (model) => {
      this.added(target, model._id, model)
    },
    changed: (model) => {
      this.changed(target, model._id, model)
    },
    removed: (model) => {
      this.removed(target, model._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
