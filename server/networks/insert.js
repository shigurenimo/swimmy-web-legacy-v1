import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

Meteor.methods({
  'networks.insert' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.name, String)
    check(req.description, String)
    const data = {
      owner: this.userId,
      name: req.name,
      description: req.description,
      member: [this.userId],
      tags: req.tags,
      channel: req.channel,
      sns: req.sns,
      schedule: {
        mon: [null, null],
        tue: [null, null],
        wed: [null, null],
        thu: [null, null],
        fri: [null, null],
        sat: [null, null],
        sun: [null, null]
      },
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
    const networkId = collections.networks.insert(data)
    if (networkId) {
      Meteor.users.update(this.userId, {
        $push: {
          'profile.networks': {
            _id: networkId,
            name: req.name
          }
        }
      })
    }
    return collections.networks.findOne(networkId)
  }
})
