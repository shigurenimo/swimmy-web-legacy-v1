import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.methods({
  'buckets.remove' (_id) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    collection.buckets.remove(_id)
  }
})
