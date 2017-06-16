import { Meteor } from 'meteor/meteor'
import collections from '/collections'

Meteor.methods({
  'tags.fetchNew' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {createdAt: -1}}).fetch()
  }
})
