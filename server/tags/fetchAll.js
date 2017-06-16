import { Meteor } from 'meteor/meteor'
import collections from '/collections'

Meteor.methods({
  'tags.fetchAll' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {count: -1}}).fetch()
  }
})
