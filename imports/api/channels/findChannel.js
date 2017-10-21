import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.methods({
  findChannel (selector = {}, options = {}) {
    const channel = collection.channels.findOne(selector, options)

    if (!channel) { throw new Meteor.Error('not-found') }

    channel.count = channel.member.length

    return channel
  }
})
