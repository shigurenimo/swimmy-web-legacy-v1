import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'channels.findOne' (selector, options) {
    const channel = collections.channels.findOne(selector, options)
    if (channel) {
      channel.count = channel.member.length
    }
    return channel
  }
})
