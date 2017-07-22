import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'channels.updateMember' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const channelId = req.channelId

    const channel = collections.channels.findOne(channelId)

    if (channel.member.includes(this.userId)) {
      collections.channels.update(channelId, {
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
      collections.channels.update(channelId, {
        $push: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $push: {
          'profile.channels': {
            _id: channelId,
            name: collections.channels.findOne(channelId).name
          }
        }
      })
    }
  }
})
