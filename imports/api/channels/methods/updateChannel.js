import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Channels } from '/imports/collection'

Meteor.methods({
  updateChannels (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    check(req.channelId, String)

    const set = {}
    const unset = {}

    if (req.name !== undefined) {
      check(req.name, String)
      set.name = req.name
    }

    if (req.description !== undefined) {
      check(req.description, String)
      set.description = req.description
    }

    if (req.channel !== undefined) {
      check(req.channel, String)
      set.channel = req.channel
    }

    set.updatedAt = new Date()

    if (Object.keys(set).length === 0 && Object.keys(unset).length === 0) return

    const query = {}

    if (Object.keys(set).length) query.$set = set

    if (Object.keys(unset).length) query.$unset = unset

    Channels.update(req.channelId, query)

    if (req.name !== undefined) {
      Meteor.users.update({'profile.channels._id': req.channelId}, {
        $set: {
          'profile.channels.$.name': req.name
        }
      }, {multi: true})
    }

    return {reason: 'チャンネルを更新しました'}
  }
})
