import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.publish('threads', function (selector = {}, options = {}, name) {
  selector.content = {$ne: ''}

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

  const namespace = name ? 'threads.' + name : 'threads'

  const cursor = collections.posts.find(selector, options).observe({
    addedAt: (post) => {
      post.ownerId = null
      this.added(namespace, post._id, post)
    },
    changed: (post) => {
      post.ownerId = null
      this.changed(namespace, post._id, post)
    },
    removed: (post) => {
      post.ownerId = null
      this.removed(namespace, post._id)
    }
  })

  this.ready()

  this.onStop(() => { cursor.stop() })
})
