import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.methods({
  'channels.findOne' (selector = {}, options = {}) {
    const channel = collection.channels.findOne(selector, options)

    if (!channel) { throw new Meteor.Error('not-found') }

    channel.count = channel.member.length

    return channel
  }
})
