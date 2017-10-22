import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Channels } from '/imports/collection'

Meteor.methods({
  removeChannels (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    check(req._id, String)

    const channel = Channels.findOne(req._id)

    if (this.userId !== channel.ownerId) {
      throw new Meteor.Error('reject', 'オーナーである必要があります')
    }

    Channels.remove(req._id)

    Meteor.users.update(this.userId, {
      $pull: {
        'profile.channels': {
          _id: req._id
        }
      }
    })

    return {reason: 'チャンネルを削除しました'}
  }
})
