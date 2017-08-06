import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.methods({
  'channels.find' (selector, options) {
    return collection.channels.find(selector, options).fetch()
  }
})
