import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.methods({
  'channels.updateMember' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const channelId = req.channelId

    const channel = collection.channels.findOne(channelId)

    if (channel.member.includes(this.userId)) {
      collection.channels.update(channelId, {
        $pull: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $pull: {
          'profile.channels': {_id: channelId}
        }
      })
    } else {
      collection.channels.update(channelId, {
        $push: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $push: {
          'profile.channels': {
            _id: channelId,
            name: collection.channels.findOne(channelId).name
          }
        }
      })
    }
  }
})
