import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/lib/collections'

Meteor.methods({
  'channels.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req._id, String)
    const channel = collections.channels.findOne(req._id)
    if (this.userId !== channel.ownerId) {
      throw new Meteor.Error('not', '削除するにはオーナーである必要があります')
    }
    collections.channels.remove(req._id)
    Meteor.users.update(this.userId, {
      $pull: {
        'profile.channels': {
          _id: req._id
        }
      }
    })
    return req._id
  }
})
