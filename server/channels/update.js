import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/lib/collections'

Meteor.methods({
  'channels.update' (req) {
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
    if (req.header !== undefined) {
      check(req.header, String)
      if (req.header === '') {
        unset.header = ''
      } else {
        set.header = req.header
      }
    }
    if (req.univ !== undefined) {
      check(req.univ, String)
      if (req.univ === '') {
        unset.univ = ''
      } else {
        set.univ = req.univ
      }
    }
    if (req.place !== undefined) {
      check(req.place, String)
      if (req.place === '') {
        unset.place = ''
      } else {
        set.place = req.place
      }
    }
    if (req.channel !== undefined) {
      check(req.channel, String)
      set.channel = req.channel
    }
    if (req.email !== undefined) {
      check(req.email, String)
      if (req.email === '') {
        unset.email = ''
      } else {
        set.email = req.email
      }
    }
    if (req.sns !== undefined) {
      check(req.sns, Object)
      set.sns = req.sns
    }
    if (req.tags !== undefined) {
      check(req.tags, Array)
      set.tags = req.tags
    }
    if (req.schedule !== undefined) {
      check(req.bad, Object)
      set.schedule = req.schedule
    }
    set.updatedAt = new Date()
    if (Object.keys(set).length === 0 && Object.keys(unset).length === 0) return
    const query = {}
    if (Object.keys(set).length) query.$set = set
    if (Object.keys(unset).length) query.$unset = unset
    collections.channels.update(req.channelId, query)
    if (req.name !== undefined) {
      Meteor.users.update({'profile.channels._id': req.channelId}, {
        $set: {
          'profile.channels.$.name': req.name
        }
      }, {multi: true})
    }
    return collections.channels.findOne(req.channelId)
  }
})
