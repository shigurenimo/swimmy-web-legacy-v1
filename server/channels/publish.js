import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.publish('channels', function () {
  return collections.channels.find({})
})
