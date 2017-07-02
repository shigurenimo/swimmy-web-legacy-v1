import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'networks.find' (selector, options) {
    return collections.networks.find(selector, options).fetch()
  }
})
