import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.methods({
  'report:main' () {
    const report = {
      total: {
        posts: collection.posts.find().count(),
        users: Meteor.users.find().count()
      }
    }
    if (this.userId) {
      report.user = {
        posts: collection.posts.find({ownerId: this.userId}).count()
      }
    }
    return report
  }
})
