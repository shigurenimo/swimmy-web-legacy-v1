import { Meteor } from 'meteor/meteor'
import { Channels } from '/imports/collection'

Meteor.methods({
  updateChannelMember (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const channelId = req.channelId

    const channel = Channels.findOne(channelId)

    if (channel.member.includes(this.userId)) {
      Channels.update(channelId, {
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
      Channels.update(channelId, {
        $push: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $push: {
          'profile.channels': {
            _id: channelId,
            name: Channels.findOne(channelId).name
          }
        }
      })

      return {reason: 'チャンネルを更新しました'}
    }
  }
})
