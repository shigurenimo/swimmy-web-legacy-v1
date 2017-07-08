import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/lib/collections'

Meteor.methods({
  'channels.insert' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.name, String)
    check(req.description, String)
    const data = {
      ownerId: this.userId,
      name: req.name,
      description: req.description,
      member: [this.userId],
      region: req.channel,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    if (req.university) {
      data.univ = req.university
    }
    if (req.email) {
      data.email = req.email
    }
    if (req.place) {
      data.place = req.place
    }
    const channelId = collections.channels.insert(data)
    if (channelId) {
      Meteor.users.update(this.userId, {
        $push: {
          'profile.channels': {
            _id: channelId,
            name: req.name
          }
        }
      })
    }
    return collections.channels.findOne(channelId)
  }
})
