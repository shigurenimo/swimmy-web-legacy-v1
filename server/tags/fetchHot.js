import { Meteor } from 'meteor/meteor'
import collections from '/collections'

Meteor.methods({
  'tags.fetchHot' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {updatedAt: -1}}).fetch()
  }
})
