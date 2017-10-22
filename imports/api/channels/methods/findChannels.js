import { Meteor } from 'meteor/meteor'
import { Channels } from '/imports/collection'

Meteor.methods({
  findChannels (selector, options) {
    return Channels.find(selector, options).fetch()
  }
})
