import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'report:main' () {
    const report = {
      total: {
        posts: collections.posts.find().count(),
        users: Meteor.users.find().count()
      }
    }
    if (this.userId) {
      report.user = {
        posts: collections.posts.find({ownerId: this.userId}).count()
      }
    }
    return report
  }
})
