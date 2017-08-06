import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.publish('channels', function () {
  return collection.channels.find({})
})
