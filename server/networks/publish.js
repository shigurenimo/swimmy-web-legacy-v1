import { Meteor } from 'meteor/meteor'
import collections from '/collections'

Meteor.publish('networks', function () {
  return collections.networks.find({})
})
