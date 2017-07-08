import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'channels.find' (selector, options) {
    return collections.channels.find(selector, options).fetch()
  }
})
