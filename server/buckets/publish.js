import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.publish('buckets', function () {
  return collection.buckets.find({})
})
