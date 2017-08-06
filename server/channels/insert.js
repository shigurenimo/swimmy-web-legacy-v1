import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collection from '/lib/collection'

Meteor.methods({
  'channels.insert' (req) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    check(req.name, String)
    check(req.description, String)

    const data = {
      ownerId: this.userId,
      name: req.name,
      description: req.description,
      member: [this.userId],
      region: req.region,
      extension: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const channelId = collection.channels.insert(data)

    if (!channelId) {
      throw new Meteor.Error('failure-insert', 'チャンネルの作成に失敗しました')
    }

    Meteor.users.update(this.userId, {
      $push: {
        'profile.channels': {
          _id: channelId,
          name: req.name
        }
      }
    })
  }
})
