import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.publish('networks', function () {
  return collections.networks.find({})
})
