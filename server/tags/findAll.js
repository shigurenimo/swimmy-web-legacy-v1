import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'tags.findAll' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {count: -1}}).fetch()
  }
})
