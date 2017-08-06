import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.publish('threads', function (selector = {}, options = {}, namespace) {
  selector.content = {$ne: ''}
  selector['replies.0'] = {$exists: true}

  options.limit = 50

  const _namespace = namespace ? 'threads.' + namespace : 'threads'

  const cursor = collection.posts.find(selector, options).observe({
    addedAt: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.added(_namespace, model._id, model)
    },
    changed: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.changed(_namespace, model._id, model)
    },
    removed: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.removed(_namespace, model._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
