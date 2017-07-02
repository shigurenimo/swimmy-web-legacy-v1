import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'tags.findNew' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {createdAt: -1}}).fetch()
  }
})
