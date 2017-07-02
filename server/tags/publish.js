import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.publish('tags', function () {
  return collections.tags.find({})
})
