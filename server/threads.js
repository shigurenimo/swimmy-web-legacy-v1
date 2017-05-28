import { Meteor } from 'meteor/meteor'
import collections from '../imports/collections'

Meteor.methods({
  'threads:fetch' (selector, options) {
    selector.content = {$ne: ''}
    selector['replies.0'] = {$exists: true}
    options.fields = {
      'owner': 0,
      'addr': 0,
      'channel': 0
    }
    options.sort = {updatedAt: -1}
    return collections.posts.find(selector, options).fetch()
  }
})
