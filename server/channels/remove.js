import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collection from '/lib/collection'

Meteor.methods({
  'channels.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    check(req._id, String)

    const channel = collection.channels.findOne(req._id)

    if (this.userId !== channel.ownerId) {
      throw new Meteor.Error('reject', 'オーナーである必要があります')
    }

    collection.channels.remove(req._id)

    Meteor.users.update(this.userId, {
      $pull: {
        'profile.channels': {
          _id: req._id
        }
      }
    })
  }
})
