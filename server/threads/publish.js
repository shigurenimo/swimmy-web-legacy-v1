import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.publish('threads', function (selector = {}, options = {}, name) {
  selector.content = {$ne: ''}
  selector['replies.0'] = {$exists: true}

  const namespace = name ? 'threads.' + name : 'threads'

  const cursor = collections.posts.find(selector, options).observe({
    addedAt: (model) => {
      if (this.userId !== model.ownerId) { delete model.ownerId }
      this.added(namespace, model._id, model)
    },
    changed: (model) => {
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
