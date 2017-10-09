import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.methods({
  'channels.find' (selector, options) {
    return collection.channels.find(selector, options).fetch()
  }
})
