import { Meteor } from 'meteor/meteor'
import collections from '/collections'

Meteor.methods({
  'threads.find' (selector, options) {
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
    return collections.posts.find(selector, options).fetch()
  }
})
