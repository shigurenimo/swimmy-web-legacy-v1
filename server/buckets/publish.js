import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.publish('buckets', function (selector, options, namespace) {
  const target = namespace ? 'buckets.' + namespace : 'buckets'

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
