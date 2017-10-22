import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.methods({
  findChannels (selector, options) {
    return collection.channels.find(selector, options).fetch()
  }
})
