import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collection from '/lib/collection'

Meteor.methods({
  'buckets.insert' (req) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    const data = {
      extension: {
        name: req.extension.name,
        note: req.extension.note
      },
      content: [],
      ownerId: this.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    collection.buckets.insert(data)
  }
})
