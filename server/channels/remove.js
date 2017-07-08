import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/lib/collections'

Meteor.methods({
  'channels.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.channelId, String)
    const channel = collections.channels.findOne(req.channelId)
    if (this.userId !== channel.owner) {
      throw new Meteor.Error('not', '削除するにはオーナーである必要があります')
    }
    collections.channels.remove(req.channelId)
    Meteor.users.update(this.userId, {
      $pull: {
        'profile.channels': {
          _id: req.channelId
        }
      }
    })
    return req.channelId
  }
})
